
import os
from datetime import datetime, timedelta
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import ipaddress

CERTS_DIR = "infrastructure/certs"

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def generate_key_and_cert(name, ca_cert=None, ca_key=None, is_ca=False):
    key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )

    subject = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, u"US"),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, u"California"),
        x509.NameAttribute(NameOID.LOCALITY_NAME, u"San Francisco"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, u"SecuRock"),
        x509.NameAttribute(NameOID.COMMON_NAME, name if not is_ca else u"SecuRock Root CA"),
    ])

    if is_ca:
        issuer = subject
    else:
        issuer = ca_cert.subject

    builder = x509.CertificateBuilder()
    builder = builder.subject_name(subject)
    builder = builder.issuer_name(issuer)
    builder = builder.public_key(key.public_key())
    builder = builder.serial_number(x509.random_serial_number())
    builder = builder.not_valid_before(datetime.utcnow())
    builder = builder.not_valid_after(datetime.utcnow() + timedelta(days=3650))
    
    if is_ca:
        builder = builder.add_extension(
            x509.BasicConstraints(ca=True, path_length=None), critical=True,
        )
    else:
        builder = builder.add_extension(
            x509.BasicConstraints(ca=False, path_length=None), critical=True,
        )
        # Add SANs for localhost and docker service names
        san_list = [
            x509.DNSName(u"localhost"),
            x509.DNSName(u"wazuh.indexer"),
            x509.DNSName(u"wazuh.manager"),
            x509.DNSName(u"wazuh.dashboard"),
            x509.IPAddress(ipaddress.IPv4Address("127.0.0.1"))
        ]
        builder = builder.add_extension(x509.SubjectAlternativeName(san_list), critical=False)

    certificate = builder.sign(
        private_key=key if is_ca else ca_key, algorithm=hashes.SHA256()
    )

    # Save
    ensure_dir(CERTS_DIR)
    
    key_path = os.path.join(CERTS_DIR, f"{name}-key.pem")
    cert_path = os.path.join(CERTS_DIR, f"{name}.pem")

    with open(key_path, "wb") as f:
        f.write(key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption(),
        ))
    
    with open(cert_path, "wb") as f:
        f.write(certificate.public_bytes(serialization.Encoding.PEM))

    print(f"Generated {name} cert and key.")
    return key, certificate

if __name__ == "__main__":
    print("Generating certificates...")
    # 1. Root CA
    ca_key, ca_cert = generate_key_and_cert("root-ca", is_ca=True)
    
    # 2. Node Cert (Admin/Manager/Indexer) - Reusing one for simplicity in MVP
    generate_key_and_cert(u"wazuh-node", ca_cert, ca_key)
    
    # 3. Dashboard Cert
    generate_key_and_cert(u"dashboard", ca_cert, ca_key)
    
    print("Certificates generated in infrastructure/certs")
