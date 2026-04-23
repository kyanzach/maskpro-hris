#!/bin/bash
source .ssh_helper.sh __source_only 2>/dev/null
export SSHPASS
sshpass -e ssh -o StrictHostKeyChecking=no root@167.71.217.49 "mysql unify_maskpro -u unify_user -pUnifyM@skpr0_2026\! -e \"ALTER TABLE hr_shifts ADD COLUMN late_grace_period_mins INT DEFAULT 15; DROP TABLE IF EXISTS hr_work_shifts;\""
