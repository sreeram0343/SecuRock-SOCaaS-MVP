import datetime

class ResponseEngine:
    def execute_response(self, threat: dict):
        """
        Determine automated response based on threat type.
        Returns command for Agent to execute.
        """
        attack_type = threat["attack_type"]
        
        if attack_type == "Ransomware Behavior":
            return {
                "action": "LOCK_FILESYSTEM",
                "log": f"[{datetime.datetime.now()}] AUTOMATED: Filesystem Locked. Ransomware blocked.",
                "status": "ISOLATED"
            }
            
        if attack_type == "Trojan Execution":
            return {
                "action": "KILL_PROCESS",
                "log": f"[{datetime.datetime.now()}] AUTOMATED: Malicious process terminated.",
                "status": "ISOLATED"
            }
            
        if attack_type == "Crypto Mining Attack":
            return {
                "action": "THROTTLE_CPU",
                "log": f"[{datetime.datetime.now()}] AUTOMATED: CPU workload throttled/terminated.",
                "status": "WARNING"
            }
        
        return {"action": "MONITOR", "log": "No action taken.", "status": "SAFE"}
