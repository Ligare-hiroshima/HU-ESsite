'use client';

import { useState, useMemo } from 'react';
import { usePostStore } from '@/stores/postStore';
import { PostCard } from '@/components/posts/PostCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, SlidersHorizontal, FileSearch } from 'lucide-react';
import { SelectionType, JobFamily, BroadField, HUFaculty } from '@/features/posts/types';
import { selectionTypeLabels, jobFamilyLabels, broadFieldLabels, industries, huFacultyLabels, huFacultiesUndergrad, huFacultiesGrad } from '@/lib/format';

type SortOrder = 'newest' | 'popular';

export default function PostsPage() {
  const { posts } = usePostStore();
  const approvedPosts = posts.filter(p => p.status === 'approved');

  const [query, setQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterSelection, setFilterSelection] = useState<SelectionType | ''>('');
  const [filterJob, setFilterJob] = useState<JobFamily | ''>('');
  const [filterYear, setFilterYear] = useState('');
  const [filterField, setFilterField] = useState<BroadField | ''>('');
  const [filterFaculty, setFilterFaculty] = useState<HUFaculty | ''>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const years = [...new Set(approvedPosts.map(p => p.graduationYear))].sort((a, b) => b - a);

  const filtered = useMemo(() => {
    let result = approvedPosts;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.companyName.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.posterMemo?.toLowerCase().includes(q)
      );
    }
    if (filterIndustry) result = result.filter(p => p.industry === filterIndustry);
    if (filterSelection) result = result.filter(p => p.selectionType === filterSelection);
    if (filterJob) result = result.filter(p => p.jobFamily === filterJob);
    if (filterYear) result = result.filter(p => p.graduationYear === parseInt(filterYear));
    if (filterField) result = result.filter(p => p.broadField === filterField);
    if (filterFaculty) result = result.filter(p => p.faculty === filterFaculty);

    if (sortOrder === 'newest') {
      result = [...result].sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
    } else {
      result = [...result].sort((a, b) => b.viewCount - a.viewCount);
    }

    return result;
  }, [approvedPosts, query, filterIndustry, filterSelection, filterJob, filterYear, filterField, sortOrder]);

  const hasFilters = !!(query || filterIndustry || filterSelection || filterJob || filterYear || filterField || filterFaculty);

  const clearFilters = () => {
    setQuery('');
    setFilterIndustry('');
    setFilterSelection('');
    setFilterJob('');
    setFilterYear('');
    setFilterField('');
    setFilterFaculty('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">ES一覧</h1>
        <p className="mt-1 text-sm text-gray-500">広大生が投稿した通過ESを検索・閲覧できます</p>
      </div>

      {/* Search + filter bar */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="企業名・業界・キーワードで検索"
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'border-blue-500 text-blue-600' : ''}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">業界</label>
                <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">すべて</option>
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">選考種別</label>
                <select value={filterSelection} onChange={e => setFilterSelection(e.target.value as SelectionType | '')} className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">すべて</option>
                  {(Object.entries(selectionTypeLabels) as [SelectionType, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">職種</label>
                <select value={filterJob} onChange={e => setFilterJob(e.target.value as JobFamily | '')} className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">すべて</option>
                  {(Object.entries(jobFamilyLabels) as [JobFamily, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">卒年</label>
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">すべて</option>
                  {years.map(y => <option key={y} value={y}>{y}卒</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">文理</label>
                <select value={filterField} onChange={e => setFilterField(e.target.value as BroadField | '')} className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">すべて</option>
                  {(Object.entries(broadFieldLabels) as [BroadField, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">学部・研究科</label>
                <select value={filterFaculty} onChange={e => setFilterFaculty(e.target.value as HUFaculty | '')} className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">すべて</option>
                  <optgroup label="── 学部 ──">
                    {huFacultiesUndergrad.map(f => <option key={f} value={f}>{huFacultyLabels[f]}</option>)}
                  </optgroup>
                  <optgroup label="── 研究科 ──">
                    {huFacultiesGrad.map(f => <option key={f} value={f}>{huFacultyLabels[f]}</option>)}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{filtered.length}件</span>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200">
                <X className="h-3 w-3" />
                フィルタ解除
              </button>
            )}
          </div>
          <div className="flex gap-1 rounded-full bg-gray-100 p-1">
            <button onClick={() => setSortOrder('newest')} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${sortOrder === 'newest' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>新着順</button>
            <button onClick={() => setSortOrder('popular')} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${sortOrder === 'popular' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>人気順</button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="該当するESが見つかりませんでした"
          description="検索条件を変えてみてください"
          action={hasFilters ? <Button variant="outline" onClick={clearFilters}>フィルタを解除</Button> : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
