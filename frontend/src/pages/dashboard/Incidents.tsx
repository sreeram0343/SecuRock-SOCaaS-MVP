

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, Plus, MoveRight, ListTodo } from 'lucide-react';

import { useEffect } from 'react';
import { useIncidentStore } from '@/store/incidentStore';

export default function Incidents() {
    const { incidents, fetchIncidents } = useIncidentStore();

    useEffect(() => {
        fetchIncidents();
    }, [fetchIncidents]);

    const columns = [
        { id: 'new', title: 'New Incidents' },
        { id: 'in_progress', title: 'Investigation' },
        { id: 'resolved', title: 'Resolved' },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-glow mb-2">Incident Response</h1>
                    <p className="text-muted-foreground">Manage, investigate, and resolve security incidents</p>
                </div>
                <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/30 border border-destructive/50">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Incident
                </Button>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
                {columns.map((col) => (
                    <div key={col.id} className="bg-card/20 backdrop-blur-md rounded-xl p-4 flex flex-col h-full border border-border shadow-inner">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                {col.id === 'new' && <ShieldAlert className="w-5 h-5 text-destructive" />}
                                {col.id === 'in_progress' && <ListTodo className="w-5 h-5 text-yellow-500" />}
                                {col.id === 'resolved' && <ShieldAlert className="w-5 h-5 text-primary" />}
                                {col.title}
                            </h3>
                            <span className="text-xs font-mono bg-background/50 px-2 py-1 rounded text-muted-foreground">
                                {incidents.filter(i => i.status === col.id).length}
                            </span>
                        </div>

                        <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                            {incidents.filter(i => i.status === col.id).length === 0 ? (
                                <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center h-full opacity-50">
                                    <p className="text-sm">No incidents</p>
                                </div>
                            ) : (
                                incidents.filter(i => i.status === col.id).map(incident => (
                                    <Card key={incident.id} className="bg-card/40 border-border cursor-move hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group relative overflow-hidden">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${incident.priority === 'high' ? 'bg-destructive' :
                                            incident.priority === 'medium' ? 'bg-yellow-500' :
                                                'bg-primary'
                                            }`} />
                                        <CardContent className="p-4 pl-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wide ${incident.priority === 'high' ? 'bg-destructive/20 text-destructive border-destructive/50' :
                                                    incident.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' :
                                                        'bg-primary/20 text-primary border-primary/50'
                                                    }`}>
                                                    {incident.priority}
                                                </span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-1">
                                                    <MoveRight className="w-4 h-4 text-muted-foreground hover:text-primary" />
                                                </Button>
                                            </div>
                                            <h4 className="text-foreground font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{incident.title}</h4>
                                            <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{incident.description}</p>
                                            <div className="mt-3 flex justify-between items-center text-[10px] text-muted-foreground">
                                                <span className="font-mono">ID: #{incident.id}</span>
                                                <span>2m ago</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

