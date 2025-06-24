#!/bin/bash
# FitFoot Development Dashboard Wrapper
cd "$(dirname "$0")"
exec node scripts/dev-dashboard.js "$@" 