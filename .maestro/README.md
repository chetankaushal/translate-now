# Smoke tests

Run locally against a booted simulator/emulator:

    MAESTRO_APP_ID=com.movil.translatenow maestro test .maestro/

Flows run in filename order. `01` proves the app boots and mounts.
`02` and `03` prove features work end to end through the real store and
provider layers.
