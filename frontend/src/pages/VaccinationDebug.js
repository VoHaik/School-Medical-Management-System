import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import api from '../utils/api';

const VaccinationDebug = () => {
    const [debugData, setDebugData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchDebugData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/vaccination-management/debug/vaccination-data');
            setDebugData(response.data);
            setMessage('Debug data loaded successfully');
        } catch (error) {
            console.error('Error fetching debug data:', error);
            setMessage('Error fetching debug data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const triggerConsent = async (eventId) => {
        setLoading(true);
        try {
            const response = await api.post(`/vaccination-management/debug/trigger-consent/${eventId}`);
            setMessage('Consent trigger result: ' + JSON.stringify(response.data));
            // Refresh debug data
            await fetchDebugData();
        } catch (error) {
            console.error('Error triggering consent:', error);
            setMessage('Error triggering consent: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDebugData();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Vaccination Debug Information</h1>
            
            {message && (
                <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded">
                    {message}
                </div>
            )}

            <div className="mb-4">
                <Button onClick={fetchDebugData} disabled={loading}>
                    {loading ? 'Loading...' : 'Refresh Debug Data'}
                </Button>
            </div>

            {debugData && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vaccination Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Total Vaccination Events: {debugData.vaccinationEventsCount}</p>
                            {debugData.vaccinationEvents?.map((event, index) => (
                                <div key={index} className="border p-4 mt-2 rounded">
                                    <p><strong>Event ID:</strong> {event.eventId}</p>
                                    <p><strong>Name:</strong> {event.eventName}</p>
                                    <p><strong>Target Date:</strong> {event.targetDate}</p>
                                    <p><strong>Grade Levels Count:</strong> {event.gradeLevelsCount}</p>
                                    <Button 
                                        onClick={() => triggerConsent(event.eventId)}
                                        className="mt-2"
                                        disabled={loading}
                                    >
                                        Trigger Consent for this Event
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Students Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Total Students: {debugData.totalStudentsCount}</p>
                            <h4 className="font-bold mt-4">Sample Students:</h4>
                            {debugData.sampleStudents?.map((student, index) => (
                                <div key={index} className="border p-2 mt-1 rounded">
                                    <p><strong>Code:</strong> {student.studentCode}</p>
                                    <p><strong>Name:</strong> {student.fullName}</p>
                                    <p><strong>Grade Level:</strong> {student.gradeLevel}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Vaccination Consents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Total Vaccination Consents: {debugData.vaccinationConsentsCount}</p>
                            {debugData.allConsents?.map((consent, index) => (
                                <div key={index} className="border p-2 mt-1 rounded">
                                    <p><strong>Consent ID:</strong> {consent.consentId}</p>
                                    <p><strong>Event ID:</strong> {consent.eventId}</p>
                                    <p><strong>Student Code:</strong> {consent.studentCode}</p>
                                    <p><strong>Status:</strong> {consent.status}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default VaccinationDebug;
