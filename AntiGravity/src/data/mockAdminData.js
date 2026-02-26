// src/data/mockAdminData.js

// Clients with varying granular permissions set by HQ
export const initialClients = [
    {
        id: "client-1",
        name: "Urban Naps Central",
        brandingType: "urban-naps",
        customTheme: null,
        defaultRequiresEmailLogin: false,
        defaultIsPaid: true,
        whitelistedDomains: [],
        permissions: {
            canEditBranding: false,
            canOverrideLoginRules: true,
            canDefineNapPricing: true
        }
    },
    {
        id: "client-2",
        name: "Acme Wellness",
        brandingType: "custom",
        customTheme: "#4F46E5",
        defaultRequiresEmailLogin: true,
        defaultIsPaid: true,
        whitelistedDomains: ["acme.com", "acmewellness.com"],
        permissions: {
            canEditBranding: true,
            canOverrideLoginRules: false,
            canDefineNapPricing: true
        }
    },
    {
        id: "client-3",
        name: "WeWork Co-working",
        brandingType: "custom",
        customTheme: "#10B981",
        defaultRequiresEmailLogin: false,
        defaultIsPaid: false,
        whitelistedDomains: ["wework.com"],
        permissions: {
            canEditBranding: true,
            canOverrideLoginRules: true,
            canDefineNapPricing: true
        }
    },
    {
        id: "client-4",
        name: "Delta Airport Lounges",
        brandingType: "urban-naps",
        customTheme: null,
        defaultRequiresEmailLogin: true,
        defaultIsPaid: false,
        whitelistedDomains: [],
        permissions: {
            canEditBranding: false,
            canOverrideLoginRules: false,
            canDefineNapPricing: false
        }
    }
];

// Locations owned by Clients
export const initialLocations = [
    {
        id: "loc-1",
        clientId: "client-1",
        name: "HQ Model Showcase"
    },
    {
        id: "loc-2",
        clientId: "client-2",
        name: "Acme Downtown HQ"
    },
    {
        id: "loc-3",
        clientId: "client-3",
        name: "WeWork Floor 5"
    },
    {
        id: "loc-4",
        clientId: "client-4",
        name: "JFK Terminal 4"
    }
];

// Pods assigned to specific Locations
export const initialPods = [
    {
        id: "pod-101",
        type: "Sleep Pod",
        clientId: "client-1",
        locationId: "loc-1",
        name: "Alpha Unit",
        overrides: {
            requiresEmailLogin: null,
            isPaid: null,
            allowAdvanceBooking: true
        },
        napOptions: [
            { durationMinutes: 30, price: 15 },
            { durationMinutes: 60, price: 25 },
        ]
    },
    {
        id: "pod-102",
        type: "Work Pod",
        clientId: "client-2",
        locationId: "loc-2",
        name: "Lobby Station A",
        overrides: {
            requiresEmailLogin: null,
            isPaid: false,
            allowAdvanceBooking: false
        },
        napOptions: [
            { durationMinutes: 20, price: 10 },
            { durationMinutes: 45, price: 20 },
            { durationMinutes: 90, price: 35 }
        ]
    },
    {
        id: "pod-103",
        type: "Aero Pod",
        clientId: "client-3",
        locationId: "loc-3",
        name: "Quiet Room 1",
        overrides: {
            requiresEmailLogin: null,
            isPaid: null,
            allowAdvanceBooking: true
        },
        napOptions: [
            { durationMinutes: 15, price: 0 },
            { durationMinutes: 30, price: 0 },
        ]
    },
    {
        id: "pod-104",
        type: "Sleep Pod",
        clientId: "client-4",
        locationId: "loc-4",
        name: "Lounge Rear Bay",
        overrides: {
            requiresEmailLogin: null,
            isPaid: null,
            allowAdvanceBooking: true
        },
        napOptions: [
            { durationMinutes: 45, price: 0 },
            { durationMinutes: 120, price: 0 },
        ]
    }
];

// Promotions and Discounts
export const initialPromotions = [
    {
        id: "promo-1",
        clientId: "client-1", // Urban Naps Central
        code: "STARTUP50",
        discountType: "percentage", // 'percentage' or 'fixed'
        discountValue: 50, // 50%
        active: true,
        maxUses: 1000,
        currentUses: 142,
        minimumSpend: 0,
        startDate: "2023-01-01",
        endDate: "2029-12-31",
        description: "Universal startup 50% discount to drive adoption."
    },
    {
        id: "promo-2",
        clientId: "client-2", // Acme Wellness
        code: "WINTERFREE",
        discountType: "fixed", // $ off
        discountValue: 15, // $15 off
        active: true,
        maxUses: 50,
        currentUses: 50, // Reached max
        minimumSpend: 10,
        startDate: "2024-11-01",
        endDate: "2025-03-01",
        description: "Acme corporate holiday perk. Fully consumed."
    }
];
