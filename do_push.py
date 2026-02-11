# -*- coding: utf-8 -*-
import subprocess, os
os.chdir(r'D:\Code\card')

subprocess.run(['git', 'add', '-A'])

msg = '优化国内访问：替换CDN为国内源，添加本地服务器启动脚本'
with open('commit_msg.txt', 'wb') as f:
    f.write(msg.encode('utf-8'))

subprocess.run(['git', 'commit', '--file=commit_msg.txt'], capture_output=True)
os.remove('commit_msg.txt')

r1 = subprocess.run(['git', 'push', 'github', 'master'], capture_output=True)
print('GitHub:', 'OK' if r1.returncode == 0 else 'FAIL')

r2 = subprocess.run(['git', 'push', 'origin', 'master'], capture_output=True)
print('Gitee:', 'OK' if r2.returncode == 0 else 'FAIL')
