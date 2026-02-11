# -*- coding: utf-8 -*-
import subprocess, os
os.chdir(r'D:\Code\card')

subprocess.run(['git', 'rm', 'do_push.py'], capture_output=True)
subprocess.run(['git', 'add', '-A'])

msg = '清理临时文件'
with open('commit_msg.txt', 'wb') as f:
    f.write(msg.encode('utf-8'))

subprocess.run(['git', 'commit', '--file=commit_msg.txt'], capture_output=True)
os.remove('commit_msg.txt')

r1 = subprocess.run(['git', 'push', 'github', 'master'], capture_output=True)
print('GitHub:', 'OK' if r1.returncode == 0 else 'FAIL')

r2 = subprocess.run(['git', 'push', 'origin', 'master'], capture_output=True)
print('Gitee:', 'OK' if r2.returncode == 0 else 'FAIL')
