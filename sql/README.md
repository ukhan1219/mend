# First time setup
1. Get on to the bitnami server:
    - Through AWS Lightsail clicking the server terminal.
    or
    - By sshing from your device if registered.
2. Log into the database:
    - Run ```mariadb -u root -p```
    - Enter the password found in ```bitnami_application_password```
3. Run the script:
    - Run ```source /opt/bitnami/apache/htdocs/sql/init.sql```
4. Make an account with permissions:
    - Run: ```CREATE USER 'journal_user'@'localhost' IDENTIFIED BY 'secure_password';```
        - You decide ```journal_user``` and ```secure_password```.
    - Run: ```GRANT ALL PRIVILEGES ON mend.* TO 'journal_user'@'localhost';```
