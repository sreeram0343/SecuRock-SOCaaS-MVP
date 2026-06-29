import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
    Sliders, 
    Key, 
    Shield, 
    User, 
    Copy, 
    Check, 
    Plus, 
    Trash2, 
    Info, 
    ToggleLeft, 
    ToggleRight, 
    AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to decode JWT
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState<'general' | 'api' | 'role'>('general');
    
    // User info decoded from token
    const [userInfo, setUserInfo] = useState<{
        userId: string;
        organizationId: string;
        role: string;
    } | null>(null);

    // General settings states
    const [anomalyThreshold, setAnomalyThreshold] = useState<number>(0.80);
    const [realtimeAnalysis, setRealtimeAnalysis] = useState<boolean>(true);
    const [webhookUrl, setWebhookUrl] = useState<string>('https://securock.ai/webhook/alerts');

    // API Keys states
    const [apiKeys, setApiKeys] = useState<Array<{ id: string; name: string; key: string; created: string }>>([
        { id: '1', name: 'Wazuh Agent Integration', key: 'sr_live_df890123...4a2b', created: '2026-06-01' },
        { id: '2', name: 'Local Network Sniffer', key: 'sr_live_a1b2c3d4...9z0x', created: '2026-06-15' }
    ]);
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = parseJwt(token);
            if (decoded) {
                setUserInfo({
                    userId: decoded.user_id || 'N/A',
                    organizationId: decoded.organization_id || 'N/A',
                    role: decoded.role || 'analyst'
                });
            }
        } else {
            // Default mock info for development representation
            setUserInfo({
                userId: 'usr_mock_sreeram_88',
                organizationId: 'org_securock_mvp_prod',
                role: 'admin'
            });
        }
    }, []);

    const handleGenerateApiKey = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim()) return;
        
        const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const newKeyVal = `sr_live_${randomHex}`;
        
        const newKeyEntry = {
            id: Date.now().toString(),
            name: newKeyName,
            key: `${newKeyVal.substring(0, 12)}...${newKeyVal.substring(newKeyVal.length - 4)}`,
            created: new Date().toISOString().split('T')[0]
        };

        setApiKeys([...apiKeys, newKeyEntry]);
        setGeneratedKey(newKeyVal);
        setNewKeyName('');
    };

    const handleDeleteKey = (id: string) => {
        setApiKeys(apiKeys.filter(k => k.id !== id));
        if (generatedKey) setGeneratedKey(null);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const rolePermissions: Record<string, string[]> = {
        admin: ["read:logs", "write:logs", "read:dashboard", "admin:system"],
        analyst: ["read:logs", "read:dashboard"],
        viewer: ["read:dashboard"]
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-glow mb-2">SOC Settings</h1>
                <p className="text-muted-foreground">Manage your threat detection rules, secure integrations, and check access control bounds.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border space-x-6 pb-2">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-all relative ${
                        activeTab === 'general' ? 'text-primary' : 'text-muted-foreground hover:text-white'
                    }`}
                >
                    <Sliders size={16} />
                    <span>General Thresholds</span>
                    {activeTab === 'general' && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('api')}
                    className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-all relative ${
                        activeTab === 'api' ? 'text-primary' : 'text-muted-foreground hover:text-white'
                    }`}
                >
                    <Key size={16} />
                    <span>API Integrations</span>
                    {activeTab === 'api' && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('role')}
                    className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-all relative ${
                        activeTab === 'role' ? 'text-primary' : 'text-muted-foreground hover:text-white'
                    }`}
                >
                    <Shield size={16} />
                    <span>RBAC Permissions</span>
                    {activeTab === 'role' && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
            </div>

            {/* Tab Contents */}
            <div className="mt-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'general' && (
                        <motion.div
                            key="general"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <Card className="bg-card/30 backdrop-blur-md border-border">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <Sliders className="text-primary w-5 h-5" /> Anomaly Score Threshold
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Adjust the model's confidence scoring threshold for raising security alerts.
                                        Lowering this values exposes the system to more alerts (higher recall, potential false positives).
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Sensitivity Level: <strong>{anomalyThreshold * 100}%</strong></span>
                                            <span className="text-primary font-semibold">
                                                {anomalyThreshold >= 0.85 ? 'Strict (Fewer Alerts)' : anomalyThreshold >= 0.70 ? 'Balanced' : 'High Alert State'}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.50"
                                            max="0.95"
                                            step="0.05"
                                            value={anomalyThreshold}
                                            onChange={(e) => setAnomalyThreshold(parseFloat(e.target.value))}
                                            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>0.50 (Frequent)</span>
                                            <span>0.75 (Recommended)</span>
                                            <span>0.95 (High Confidence Only)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/30 backdrop-blur-md border-border">
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="text-xl font-semibold">System Operational Baselines</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 border border-border bg-card/10 rounded-lg">
                                            <div className="text-xs text-muted-foreground">Average Packet Size</div>
                                            <div className="text-lg font-bold mt-1 text-primary">350.0 Bytes</div>
                                        </div>
                                        <div className="p-4 border border-border bg-card/10 rounded-lg">
                                            <div className="text-xs text-muted-foreground">Normal Request Rate</div>
                                            <div className="text-lg font-bold mt-1 text-primary">12.0 req/sec</div>
                                        </div>
                                        <div className="p-4 border border-border bg-card/10 rounded-lg">
                                            <div className="text-xs text-muted-foreground">Socket Duration Baseline</div>
                                            <div className="text-lg font-bold mt-1 text-primary">4.5 seconds</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 bg-primary/10 border border-primary/20 text-xs p-3 rounded-lg text-primary">
                                        <Info size={16} className="shrink-0 mt-0.5" />
                                        <span>These baselines are updated periodically during retraining of the Isolation Forest ML model.</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card/30 backdrop-blur-md border-border">
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="text-xl font-semibold flex items-center justify-between">
                                        <span>Real-time Ingestion Stream</span>
                                        <button 
                                            onClick={() => setRealtimeAnalysis(!realtimeAnalysis)} 
                                            className="text-primary focus:outline-none"
                                        >
                                            {realtimeAnalysis ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-muted-foreground" />}
                                        </button>
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        When active, incoming endpoint telemetry streams through Redis Streams and is scored instantly.
                                    </p>
                                    
                                    <div className="space-y-2 pt-2">
                                        <label className="text-xs text-muted-foreground block">Webhook Notification URL</label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={webhookUrl}
                                                onChange={(e) => setWebhookUrl(e.target.value)}
                                                className="bg-black/50 border-border text-white flex-1"
                                            />
                                            <Button className="bg-primary hover:bg-primary/95 text-primary-foreground">Save</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'api' && (
                        <motion.div
                            key="api"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <Card className="bg-card/30 backdrop-blur-md border-border">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <Key className="text-primary w-5 h-5" /> Active API Keys
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Use these API keys in your log forwarding agents (e.g. Syslog receivers, Wazuh loggers)
                                        by specifying the <code>X-API-Key</code> header on ingress HTTP requests.
                                    </p>

                                    <div className="space-y-3">
                                        {apiKeys.map(key => (
                                            <div 
                                                key={key.id}
                                                className="flex items-center justify-between p-4 border border-border bg-black/30 rounded-lg hover:border-primary/30 transition-all"
                                            >
                                                <div>
                                                    <div className="font-semibold text-sm">{key.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Key: <code className="text-primary/80 font-mono">{key.key}</code> • Created: {key.created}
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDeleteKey(key.id)}
                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Generate form */}
                                    <form onSubmit={handleGenerateApiKey} className="flex flex-col md:flex-row gap-3 pt-2">
                                        <Input
                                            placeholder="Forwarder/Agent Identification Name..."
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            className="bg-black/50 border-border text-white flex-1"
                                        />
                                        <Button 
                                            type="submit"
                                            className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/30"
                                        >
                                            <Plus size={16} className="mr-1" /> Generate API Key
                                        </Button>
                                    </form>

                                    {/* Generated Key Alert Block */}
                                    {generatedKey && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-between"
                                        >
                                            <div className="space-y-1">
                                                <div className="text-xs font-semibold text-primary uppercase tracking-wide">Copy Generated Key</div>
                                                <div className="font-mono text-sm font-bold select-all break-all pr-4">{generatedKey}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <AlertCircle size={12} className="text-orange-500" />
                                                    <span>Make sure to copy this key now. You won't be able to see it again!</span>
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={() => copyToClipboard(generatedKey)}
                                                className="bg-primary hover:bg-primary/95 text-primary-foreground h-9 w-9 shrink-0 p-0"
                                            >
                                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                            </Button>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'role' && userInfo && (
                        <motion.div
                            key="role"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <Card className="bg-card/30 backdrop-blur-md border-border">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <Shield className="text-primary w-5 h-5" /> Security & Role Context
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground block">Assigned User Role</span>
                                            <div className="flex items-center gap-2">
                                                <User className="text-primary w-4 h-4" />
                                                <span className="font-bold capitalize text-glow">{userInfo.role}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground block">Active Organization / Tenant ID</span>
                                            <span className="font-mono text-sm break-all font-semibold select-all text-primary/80">{userInfo.organizationId}</span>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground block">Current User ID</span>
                                            <span className="font-mono text-sm break-all font-semibold select-all text-primary/80">{userInfo.userId}</span>
                                        </div>
                                    </div>

                                    {/* Permissions details list */}
                                    <div className="border-t border-border pt-6 space-y-4">
                                        <h4 className="font-semibold text-md text-white">Granted Cryptographic Permissions</h4>
                                        <p className="text-xs text-muted-foreground">
                                            These permissions are embedded into your JWT access token cryptographically.
                                            API endpoints will inspect the token on execution.
                                        </p>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {(rolePermissions[userInfo.role] || ["read:dashboard"]).map(perm => (
                                                <div 
                                                    key={perm}
                                                    className="flex items-center gap-2 p-2 px-3 border border-primary/20 bg-primary/5 rounded text-sm text-primary font-medium"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                    <span>{perm}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
