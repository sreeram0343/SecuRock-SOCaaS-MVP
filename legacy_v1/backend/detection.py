from datetime import datetime

class DetectionEngine:
    def check_threat(self, data: dict) -> dict | None:
        """
        Analyze telemetry for Multi-Vector Threats.
        1. CPU > 80% -> Crypto Mining
        2. Process == 'evil_process_sim.py' -> Trojan
        3. File Activity > 20 -> Ransomware Burst
        """
        cpu_usage = data.get("cpu", 0)
        process_name = data.get("process", "unknown")
        file_activity = data.get("file_activity", 0)
        
        timestamp = datetime.now().isoformat()
        
        # Priority 1: Ransomware (High File Activity)
        if file_activity > 20: 
             return {
                "severity": "CRITICAL",
                "attack_type": "Ransomware Behavior",
                "details": f"Rapid file creation detected ({file_activity} ops/sec)",
                "timestamp": timestamp
            }
            
        # Priority 2: Trojan (Known Evil Process)
        if "evil_process" in process_name or "trojan" in process_name:
             return {
                "severity": "CRITICAL",
                "attack_type": "Trojan Execution",
                "details": f"Unauthorized process detected: {process_name}",
                "timestamp": timestamp
            }
        
        # Priority 3: Crypto Mining (High CPU)
        if cpu_usage > 80:
             return {
                "severity": "HIGH", # Critical/High
                "attack_type": "Crypto Mining Attack",
                "details": f"Abnormal CPU usage ({cpu_usage}%) by {process_name}",
                "timestamp": timestamp
            }
            
        return None
