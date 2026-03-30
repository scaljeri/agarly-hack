gpg --list-secret-keys

rm -rf ~/.gnupg
mkdir ~/.gnupg
chmod 700 ~/.gnupg

gpg --import /home/vscode/key.asc