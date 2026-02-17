#!/bin/sh

echo "Attente que MySQL soit prêt..."
until nc -z db 3306; do
  echo "MySQL non prêt, attente 2s..."
  sleep 2
done

echo "MySQL prêt, démarrage du backend..."
exec "$@"
