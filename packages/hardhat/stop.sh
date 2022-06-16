#!/bin/bash
kill -2 $(ps aux | grep namespace=chainServer | grep ./chain | grep -v grep | awk '{print $2}') 2>/dev/null