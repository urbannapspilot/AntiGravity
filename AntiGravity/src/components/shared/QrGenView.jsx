import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

export const QrGenView = ({ availablePods, availableLocations }) => {
    const [qrType, setQrType] = useState('pod'); // 'pod' or 'location'
    const [selectedId, setSelectedId] = useState('');
    const [qrValue, setQrValue] = useState('');

    const generateQrCode = () => {
        if (selectedId) {
            // In a real app, this would be a dynamic URL pointing to the user interface
            if (qrType === 'pod') {
                setQrValue(`https://urbannaps.com/scan?podId=${selectedId}`);
            } else {
                setQrValue(`https://urbannaps.com/scan?locationId=${selectedId}`);
            }
        } else {
            setQrValue('');
        }
    };

    // Reset selection when changing type
    useEffect(() => {
        setSelectedId('');
        setQrValue('');
    }, [qrType]);

    return (
        <div className="p-8 animate-fade-in max-w-3xl">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">QR Code Generator</h2>
            <p className="text-sm text-slate-500 mb-8">Generate and print QR codes for your locations or pods to enable quick access for users.</p>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                {/* QR Type Toggle */}
                <div className="flex gap-6 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="qrType"
                            value="pod"
                            checked={qrType === 'pod'}
                            onChange={() => setQrType('pod')}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Specific Pod</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="qrType"
                            value="location"
                            checked={qrType === 'location'}
                            onChange={() => setQrType('location')}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Entire Location</span>
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {qrType === 'pod' ? 'Select a Pod' : 'Select a Location'}
                    </label>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 text-sm"
                    >
                        <option value="">{qrType === 'pod' ? 'Select a pod...' : 'Select a location...'}</option>
                        {qrType === 'pod' ? (
                            availablePods.map(pod => (
                                <option key={pod.id} value={pod.id}>{pod.name} ({pod.id})</option>
                            ))
                        ) : (
                            availableLocations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name} ({loc.id})</option>
                            ))
                        )}
                    </select>
                </div>

                <button
                    onClick={generateQrCode}
                    disabled={!selectedId}
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generate QR Code
                </button>

                {qrValue && (
                    <div className="pt-6 border-t border-slate-100 flex flex-col items-center justify-center space-y-4">
                        <p className="text-sm font-medium text-slate-700">
                            {qrType === 'pod' ? 'Scan this QR code to access the pod:' : 'Scan this QR code to view the location:'}
                        </p>
                        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-md">
                            <QRCode value={qrValue} size={256} level="H" />
                        </div>
                        <p className="text-xs text-slate-500 font-mono break-all">{qrValue}</p>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <QrCode className="w-4 h-4" /> Print QR Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
};
