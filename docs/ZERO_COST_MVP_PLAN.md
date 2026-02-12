# Zero Cost MVP Development Plan

**Goal:** Build and deploy SecuRock SOC MVP with **₹0** financial investment.

This plan focuses on leveraging "Always Free" cloud tiers, open-source software, and resourceful architecture choices to eliminate infrastructure and tooling costs.

---

## 1. The "Zero Cost" Tech Stack

| Component | Zero Cost Solution | Limitations |
|-----------|--------------------|-------------|
| **Compute (Cloud)** | **Oracle Cloud Always Free** (ARM Ampere) | 4 OCPUs, 24GB RAM (Generous!) |
| **Frontend Hosting** | **Vercel** (Hobby Plan) | Build limits, no commercial use |
| **Backend Hosting** | Self-hosted on Oracle Cloud (Docker) | Manual management |
| **Database** | Self-hosted PostgreSQL on Oracle VM | Maintenance, backups DIY |
| **Log Storage** | Self-hosted Elasticsearch (Single Node) | RAM heavy (ok with Oracle 24GB) |
| **AI Training** | **Google Colab** (Free Tier) | Session reliability, T4 GPUs |
| **Domain/DNS** | **DuckDNS** or **No-IP** | Subdomains (e.g., securock.duckdns.org) |
| **SSL Certificates** | **Let's Encrypt** (Certbot) | Renew every 90 days |
| **Code Repo** | **GitHub** (Free Public/Private) | 2000 Action minutes/month |
| **Monitoring** | **Grafana Cloud** (Free Tier) | 10k metrics, 50GB logs |

---

## 2. Infrastructure Strategy

### Option A: The "Local Demo" (Best for Investor Pitches)
**Cost:** ₹0
**Hardware:** Your existing laptop (16GB+ RAM recommended)
**Setup:**
1. Run the entire stack via Docker Compose (as currently built).
2. For remote access (demoing to client devices), use **Cloudflare Tunnel** (Free).
   ```bash
   # Expose local port 80 to the internet securely
   cloudflared tunnel --url http://localhost:80
   ```

### Option B: Oracle Cloud "Always Free" (Best for Pilot)
**Cost:** ₹0
**Hardware:** VM.Standard.A1.Flex (4 OCPU, 24GB RAM)
**Why Oracle?** AWS/GCP/Azure free tiers (t2.micro/e2-micro) only give ~1GB RAM, which is **insufficient** for Elasticsearch + AI. Oracle gives 24GB.

**Deployment Steps:**
1. Sign up for Oracle Cloud Free Tier.
2. Provision an **Ampere A1 Compute Instance** (Ubuntu 22.04).
3. Open Ports 80, 443 in the Virtual Cloud Network (VCN) Security List.
4. SSH into the instance and install Docker/Git:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   ```
5. Clone repo and run:
   ```bash
   git clone https://github.com/your-repo/securock.git
   cd securock/infrastructure
   # Note: For ARM architecture, ensure Dockerfiles use multi-arch base images
   # (Python/Node images usually support ARM64 automatically)
   docker-compose up -d
   ```

---

## 3. Development Phase (Zero Cost)

### Tools
- **IDE:** VS Code (Free)
- **Design:** Figma (Free tier)
- **API Testing:** Postman (Free tier) or cURL
- **Database GUI:** DBeaver Community (Free)

### AI/ML Training
Do not buy GPUs. Use Google Colab.
1. Upload dataset to Google Drive.
2. Mount Drive in Colab.
3. Train Isolation Forest / Autoencoder.
4. Download `.pkl` model file.
5. Commit model to repo (if small) or use GitHub Releases.

---

## 4. Operational Costs Breakdown

| Item | Traditional Cost | Zero Cost Alternative | Saving |
|------|------------------|-----------------------|--------|
| **VM Hosting** | ₹2,500/mo | Oracle Free Tier | ₹2,500 |
| **Managed DB** | ₹1,500/mo | Docker on VM | ₹1,500 |
| **Elasticsearch** | ₹4,000/mo | Docker on VM | ₹4,000 |
| **Domain** | ₹800/yr | DuckDNS | ₹800 |
| **SSL** | ₹5,000/yr | Let's Encrypt | ₹5,000 |
| **Email API** | ₹500/mo | Gmail SMTP (Low volume) | ₹500 |
| **Total** | **~₹10,000/mo** | **₹0** | **100%** |

---

## 5. Limitations & Risks of Zero Cost

1.  **No Support SLAs:** If Oracle deletes free instances (rare but possible), you lose data.
    *   **Mitigation:** Cron script to backup Postgres dumps to Google Drive `rclone`.
2.  **ARM Architecture:** Oracle Free Tier is ARM (like Apple M1).
    *   **Mitigation:** Verify all Docker images support `linux/arm64`. Standard Python/Node images do.
3.  **Vercel/Render Cold Starts:** If using Render free tier for backend, servers sleep after inactivity.
    *   **Mitigation:** Use self-hosted Oracle VM (always on).
4.  **Email Deliverability:** Free SMTP (Gmail) often lands in spam.
    *   **Mitigation:** Use "Verify Domain" on SendGrid (100 emails/day free).

## 6. Execution Roadmap

1.  **Week 1:** Develop locally. Push to GitHub.
2.  **Week 2:** Setup Oracle Cloud account. Verify ARM availability (sometimes out of stock in Mumbai region; try Hyderabad or Singapore).
3.  **Week 3:** Deploy via Docker Compose on Oracle VM. Setup DuckDNS.
4.  **Week 4:** Configure Let's Encrypt SSL. Connect Pilot Customers via public URL.

## 7. Investor Pitch Narrative

*"We built a production-grade, microservices-based SOC platform with **zero burn rate** by leveraging efficient architecture and strategic use of cloud free tiers. This demonstrates our team's technical resourcefulness and ability to operate lean."*
