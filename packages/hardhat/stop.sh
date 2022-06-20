#!/bin/bash
kill -2 $(ps aux | grep 'hardhat node' | grep -v grep | awk '{print $2}') 2>/dev/null