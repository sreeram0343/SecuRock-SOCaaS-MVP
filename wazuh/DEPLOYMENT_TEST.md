# Agent Enrollment & Validation Playbook

This playbook provides the steps necessary to deploy a Wazuh Agent on a target Linux endpoint and verify its connection to our newly built SOCaaS platform.

## 1. Deploy the Linux Agent
Run the following commands on the target Linux endpoint. Make sure to replace `<DOCKER_HOST_IP>` with the actual IP address of the machine hosting the Wazuh Docker stack.

```bash
# Example syntax for a Debian/Ubuntu system using the official Wazuh repository:
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo apt-key add -
echo "deb https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee /etc/apt/sources.list.d/wazuh.list
sudo apt-get update

# Install the agent while passing the required initialization variables:
sudo WAZUH_MANAGER="<DOCKER_HOST_IP>" \
     WAZUH_REGISTRATION_SERVER="<DOCKER_HOST_IP>" \
     WAZUH_MANAGER_PORT="1514" \
     WAZUH_REGISTRATION_PORT="1515" \
     apt-get install -y wazuh-agent
```

## 2. Enable and Start the Agent

Next, ensure the service can run smoothly by starting it up.

```bash
sudo systemctl daemon-reload
sudo systemctl enable wazuh-agent
sudo systemctl start wazuh-agent
```

## 3. Verify the Connection

Finally, we validate that the agent has successfully checked in with the Wazuh Manager on the required ports. Run the following command on the target endpoint:

```bash
netstat -a | grep 1514
```

**Expected Result:**
You should see output similar to this, showcasing an `ESTABLISHED` TCP connection to the Docker Host:

```text
tcp        0      0 endpoint_IP:random_port    <DOCKER_HOST_IP>:1514      ESTABLISHED
```

If it shows `ESTABLISHED`, the endpoint's telemetry is now correctly flowing into the SOCaaS platform where it will be ingested into the indexer.
