#!/bin/bash
source .ssh_helper.sh __source_only 2>/dev/null
export SSHPASS
sshpass -e ssh -o StrictHostKeyChecking=no root@167.71.217.49 "mysql unify_maskpro -u unify_user -pUnifyM@skpr0_2026\! -e \"ALTER TABLE hr_holidays CHANGE holiday_date start_date DATE NOT NULL, ADD COLUMN end_date DATE NULL AFTER start_date;\""
