import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage('新密码长度至少需要6位');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setMessage('密码修改成功！');
      setCurrentPassword('');
      setNewPassword('');
    }, 500);
  };

  return (
    <div className="animate-fade-in max-w-md mx-auto mt-8 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center mb-6">
        <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4 border-2 border-emerald-500/30">
          <span className="text-3xl text-emerald-500 font-bold">{user.username.charAt(0).toUpperCase()}</span>
        </div>
        <h2 className="text-xl font-bold text-white">{user.username}</h2>
        <p className="text-slate-500 text-sm mt-1">普通会员</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">安全设置</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">当前密码</label>
            <input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">新密码</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          
          {message && (
             <p className={`text-sm text-center ${message.includes('成功') ? 'text-emerald-400' : 'text-rose-400'}`}>
               {message}
             </p>
          )}

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-colors"
          >
            修改密码
          </button>
        </form>
      </div>

      <button 
        onClick={onLogout}
        className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-lg transition-colors border border-slate-700"
      >
        退出登录
      </button>
    </div>
  );
};
