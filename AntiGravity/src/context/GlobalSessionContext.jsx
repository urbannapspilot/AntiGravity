import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const GlobalSessionContext = createContext({
    activeSessions: [],
    upcomingBookings: [],
    pastSessions: [],
    addSession: () => { },
    terminateSession: () => { },
    addBooking: () => { },
    cancelBooking: () => { }
});

export const useGlobalSession = () => useContext(GlobalSessionContext);

export const GlobalSessionProvider = ({ children }) => {
    // Array of active sessions across all pods
    const [activeSessions, setActiveSessions] = useState([]);

    // Array of scheduled future bookings
    const [upcomingBookings, setUpcomingBookings] = useState([]);

    // Array of past sessions (historical log)
    const [pastSessions, setPastSessions] = useState([]);

    // Setup BroadcastChannel for cross-tab communication
    useEffect(() => {
        // Fetch initial data from backend
        fetch(`${API_BASE_URL}/api/admin/sessions`)
            .then(res => res.json())
            .then(data => {
                if (data?.status?.success && data.data) {
                    setActiveSessions(data.data.activeSessions || []);
                    setUpcomingBookings(data.data.upcomingBookings || []);
                    setPastSessions(data.data.pastSessions || []);
                }
            })
            .catch(err => console.warn("Using default session state", err));

        const channel = new BroadcastChannel('urban_naps_session_sync');

        channel.onmessage = (event) => {
            const { type, payload } = event.data;
            if (type === 'ADD_SESSION') {
                setActiveSessions(prev => {
                    if (prev.find(s => s.id === payload.id)) return prev;
                    return [...prev, payload];
                });
            } else if (type === 'TERMINATE_SESSION') {
                setActiveSessions(prev => prev.filter(s => s.id !== payload));
            } else if (type === 'ARCHIVE_SESSION') {
                setPastSessions(prev => {
                    if (prev.find(s => s.id === payload.id)) return prev;
                    return [payload, ...prev];
                });
            } else if (type === 'ADD_BOOKING') {
                setUpcomingBookings(prev => {
                    if (prev.find(b => b.id === payload.id)) return prev;
                    return [...prev, payload].sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
                });
            } else if (type === 'CANCEL_BOOKING') {
                setUpcomingBookings(prev => prev.filter(b => b.id !== payload));
            }
        };

        return () => channel.close();
    }, []);

    // Helper to broadcast actions
    const broadcast = (type, payload) => {
        const channel = new BroadcastChannel('urban_naps_session_sync');
        channel.postMessage({ type, payload });
        channel.close();
    };

    // Add a new active session
    const addSession = (sessionData) => {
        const newSession = {
            id: `session-${Date.now()}`,
            ...sessionData,    // podId, clientId, durationMinutes, startTime
            timeLeft: sessionData.durationMinutes * 60,
        };
        setActiveSessions(prev => [...prev, newSession]);
        broadcast('ADD_SESSION', newSession);
    };

    // Terminate a session (by Admin or natural end)
    const terminateSession = (sessionId, status = 'force-ended') => {
        setActiveSessions(prev => {
            const session = prev.find(s => s.id === sessionId);
            if (session) {
                const archivedSession = { ...session, status, terminatedAt: new Date().toISOString() };
                setTimeout(() => {
                    setPastSessions(past => [archivedSession, ...past]);
                    broadcast('ARCHIVE_SESSION', archivedSession);
                    broadcast('TERMINATE_SESSION', sessionId);
                }, 0);
            }
            return prev.filter(s => s.id !== sessionId);
        });
    };

    // Add a scheduled booking
    const addBooking = (bookingData) => {
        const newBooking = {
            id: `booking-${Date.now()}`,
            ...bookingData, // podId, clientId, durationMinutes, scheduledTime, email
            createdAt: new Date().toISOString()
        };
        setUpcomingBookings(prev => [...prev, newBooking].sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)));
        broadcast('ADD_BOOKING', newBooking);
    };

    // Cancel a scheduled booking
    const cancelBooking = (bookingId) => {
        setUpcomingBookings(prev => prev.filter(b => b.id !== bookingId));
        broadcast('CANCEL_BOOKING', bookingId);
    };

    // Global timer interval to tick down all active sessions
    useEffect(() => {
        const timerId = setInterval(() => {
            setActiveSessions(prev => {
                let updated = false;
                const nextState = prev.map(session => {
                    if (session.timeLeft > 0) {
                        updated = true;
                        if (session.timeLeft - 1 === 0) {
                            setTimeout(() => terminateSession(session.id, 'completed'), 0);
                            return { ...session, timeLeft: 0 };
                        }
                        return { ...session, timeLeft: session.timeLeft - 1 };
                    }
                    return session;
                });

                return updated ? nextState : prev;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    return (
        <GlobalSessionContext.Provider value={{
            activeSessions, addSession, terminateSession,
            upcomingBookings, addBooking, cancelBooking,
            pastSessions
        }}>
            {children}
        </GlobalSessionContext.Provider>
    );
};
