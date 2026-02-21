// src/data/mockPods.js

// Clients define the branding, payment, and login rules
export const clients = [
    {
        id: "client-1",
        name: "Urban Naps Central",
        type: "buyer",
        brandingType: "urban-naps", // Default branding
        customTheme: null,
        requiresEmailLogin: false,
        isPaid: true
    },
    {
        id: "client-2",
        name: "Acme Wellness",
        type: "buyer",
        brandingType: "custom", // Custom client branding
        customTheme: "#4F46E5", // Indigo-600
        requiresEmailLogin: true,
        isPaid: true
    },
    {
        id: "client-3",
        name: "WeWork Co-working",
        type: "renter",
        brandingType: "custom",
        customTheme: "#10B981", // Emerald-500
        requiresEmailLogin: false,
        isPaid: false // Pod is free for users
    },
    {
        id: "client-4",
        name: "Delta Airport Lounges",
        type: "renter",
        brandingType: "urban-naps",
        customTheme: null,
        requiresEmailLogin: true,
        isPaid: false
    }
];

// Pods are physical units mapped to a client
export const pods = [
    {
        id: "pod-101",
        type: "Sleep Pod",
        clientId: "client-1", // Urban Naps Default (Paid, No Login)
        napOptions: [
            { duration: "30 mins", price: 15 },
            { duration: "60 mins", price: 25 },
        ]
    },
    {
        id: "pod-102",
        type: "Work Pod",
        clientId: "client-2", // Custom Brand "Acme" (Paid, Login Required)
        napOptions: [
            { duration: "20 mins", price: 10 },
            { duration: "45 mins", price: 20 },
            { duration: "90 mins", price: 35 }
        ]
    },
    {
        id: "pod-103",
        type: "Aero Pod",
        clientId: "client-3", // Custom Brand "WeWork" (Free, No Login)
        napOptions: [
            { duration: "15 mins", price: 5 }, // Client set to isPaid=false, so this price should be overridden to Free in UI
            { duration: "30 mins", price: 10 },
        ]
    },
    {
        id: "pod-104",
        type: "Sleep Pod",
        clientId: "client-4", // Urban Naps Brand (Free, Login Required)
        napOptions: [
            { duration: "45 mins", price: 0 },
            { duration: "120 mins", price: 0 },
        ]
    }
];
