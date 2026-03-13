'use client';

import { useState } from 'react';
import { mockCompanies } from '@/mocks/data/companies';
import { Company } from '@/features/posts/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { industries } from '@/lib/format';
import { Building2, Check, Pencil, X } from 'lucide-react';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Company>>({});
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  const filtered = companies.filter(c =>
    !query || c.name.includes(query) || c.normalizedName.includes(query) || c.industry.includes(query)
  );

  const startEdit = (c: Company) => { setEditing(c.id); setEditData({ normalizedName: c.normalizedName, industry: c.industry, isLocal: c.isLocal }); };
  const saveEdit = (id: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...editData } : c));
    setEditing(null);
    setSaved(prev => [...prev, id]);
    setTimeout(() => setSaved(prev => prev.filter(x => x !== id)), 2000);
  };

  const selectClass = "rounded-md border border-input bg-background px-2 py-1.5 text-sm";

  return (
    <div className="max-w-4xl space-y-4">
      <h1 className="text-xl font-bold text-gray-900">企業名正規化</h1>
      <p className="text-sm text-gray-500">投稿に含まれる企業名の表記ゆれを管理します</p>

      <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="企業名・業界で絞り込み" className="max-w-xs" />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">登録名</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">正規名</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">業界</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">地場</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-300 shrink-0" />
                    <span className="font-medium text-gray-900">{c.name}</span>
                    {c.isLocal && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">地場</span>}
                  </div>
                  {c.aliases.length > 0 && <p className="text-xs text-gray-400 mt-0.5">別名: {c.aliases.join(', ')}</p>}
                </td>
                <td className="px-4 py-3">
                  {editing === c.id ? (
                    <Input value={editData.normalizedName ?? ''} onChange={e => setEditData(d => ({ ...d, normalizedName: e.target.value }))} className="h-7 text-sm py-1" />
                  ) : (
                    <span className="text-gray-700">{c.normalizedName}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editing === c.id ? (
                    <select value={editData.industry ?? ''} onChange={e => setEditData(d => ({ ...d, industry: e.target.value }))} className={selectClass}>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  ) : (
                    <span className="text-gray-600">{c.industry}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editing === c.id ? (
                    <input type="checkbox" checked={editData.isLocal ?? false} onChange={e => setEditData(d => ({ ...d, isLocal: e.target.checked }))} className="accent-blue-600" />
                  ) : (
                    <span className="text-gray-500">{c.isLocal ? '✓' : '-'}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editing === c.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => saveEdit(c.id)} className="rounded bg-green-100 p-1.5 text-green-700 hover:bg-green-200"><Check className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setEditing(null)} className="rounded bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {saved.includes(c.id) && <Check className="h-3.5 w-3.5 text-green-500" />}
                      <button onClick={() => startEdit(c)} className="rounded bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"><Pencil className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
