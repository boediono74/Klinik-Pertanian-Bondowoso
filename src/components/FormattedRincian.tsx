import React, { useState } from 'react';
import {
  Tag,
  MapPin,
  AlertTriangle,
  FileText,
  Layers,
  Sprout,
  Activity,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface FormattedRincianProps {
  rincian: string;
  variant?: 'compact' | 'card' | 'expanded';
  maxCompactBadges?: number;
}

interface ParsedField {
  label: string;
  value: string;
  type: 'key-value' | 'tag-list' | 'narrative' | 'gps' | 'severity';
}

export function parseRincianText(raw: string): {
  fields: ParsedField[];
  tags: string[];
  narrative: string;
  gpsCoords?: string;
  severity?: string;
} {
  if (!raw) {
    return { fields: [], tags: [], narrative: '' };
  }

  let text = raw.trim();
  const fields: ParsedField[] = [];
  const tags: string[] = [];
  let narrative = '';
  let gpsCoords: string | undefined;
  let severity: string | undefined;

  // Split by "||"
  const segments = text.split('||').map(s => s.trim()).filter(Boolean);

  segments.forEach(segment => {
    // Match [Key]: Value
    const kvMatch = segment.match(/^\[([^\]]+)\]\s*:\s*(.+)$/i);
    if (kvMatch) {
      const rawKey = kvMatch[1].trim();
      const val = kvMatch[2].trim();

      // Check if it's Pilihan / Tags
      if (rawKey.toLowerCase().includes('pilihan') || rawKey.toLowerCase().includes('gejala') || rawKey.toLowerCase().includes('komoditas')) {
        const itemTags = val.split(/[,;]/).map(t => t.trim()).filter(Boolean);
        itemTags.forEach(t => {
          if (!tags.includes(t)) tags.push(t);
        });
        fields.push({ label: rawKey, value: val, type: 'tag-list' });
      } else if (rawKey.toLowerCase().includes('titik') || rawKey.toLowerCase().includes('gps') || rawKey.toLowerCase().includes('koordinat')) {
        gpsCoords = val;
        fields.push({ label: rawKey, value: val, type: 'gps' });
      } else if (rawKey.toLowerCase().includes('tingkat') || rawKey.toLowerCase().includes('serangan')) {
        severity = val;
        fields.push({ label: rawKey, value: val, type: 'severity' });
      } else if (rawKey.toLowerCase().includes('permasalahan') || rawKey.toLowerCase().includes('kendala') || rawKey.toLowerCase().includes('deskripsi')) {
        if (!narrative) narrative = val;
        else narrative += ` ${val}`;
        fields.push({ label: rawKey, value: val, type: 'narrative' });
      } else {
        fields.push({ label: rawKey, value: val, type: 'key-value' });
      }
    } else {
      // If segment doesn't match [Key]: Value, it might be free text or narrative
      const cleaned = segment.replace(/^\[([^\]]+)\]/, '').trim();
      if (!narrative) {
        narrative = cleaned;
      } else {
        narrative += ` ${cleaned}`;
      }
    }
  });

  // Check if narrative still has embedded tags or leftovers
  if (!narrative && segments.length > 0) {
    const lastSeg = segments[segments.length - 1];
    if (!lastSeg.startsWith('[')) {
      narrative = lastSeg;
    }
  }

  return { fields, tags, narrative, gpsCoords, severity };
}

export const FormattedRincian: React.FC<FormattedRincianProps> = ({
  rincian,
  variant = 'compact',
  maxCompactBadges = 3
}) => {
  const [showFull, setShowFull] = useState(false);
  const parsed = parseRincianText(rincian);

  // Quick field getters for high-priority parameters
  const getFieldVal = (terms: string[]) => {
    const f = parsed.fields.find(f => terms.some(t => f.label.toLowerCase().includes(t)));
    return f?.value;
  };

  const tanaman = getFieldVal(['tanaman', 'komoditas']);
  const luas = getFieldVal(['luas']);
  const peserta = getFieldVal(['peserta']);
  const usia = getFieldVal(['usia']);
  const permohonan = getFieldVal(['permohonan', 'bantuan']);

  // COMPACT VARIANT (for Table Cells in Officer Dashboard)
  if (variant === 'compact') {
    return (
      <div className="space-y-1.5 font-sans">
        {/* Top Badges / High-Value Parameters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tanaman && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              <Sprout className="w-3 h-3 text-emerald-600" />
              <span>{tanaman}</span>
            </span>
          )}

          {luas && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
              <Layers className="w-3 h-3 text-amber-600" />
              <span>Luas: {luas}</span>
            </span>
          )}

          {parsed.severity && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                parsed.severity.toLowerCase().includes('berat')
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : parsed.severity.toLowerCase().includes('sedang')
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-teal-50 text-teal-800 border-teal-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{parsed.severity}</span>
            </span>
          )}

          {parsed.gpsCoords && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsed.gpsCoords)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-800 hover:bg-blue-100 text-[10px] font-medium border border-blue-200 transition-colors"
              title="Buka titik koordinat lahan di Google Maps"
            >
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>Peta GPS</span>
            </a>
          )}
        </div>

        {/* Narrative / Main Description */}
        <p className="text-slate-700 text-xs leading-relaxed line-clamp-2">
          {parsed.narrative || rincian.replace(/\[[^\]]+\]:\s*/g, '')}
        </p>

        {/* Selected Checkboxes / Tags if any */}
        {parsed.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {parsed.tags.slice(0, maxCompactBadges).map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
            {parsed.tags.length > maxCompactBadges && (
              <span className="text-[10px] text-slate-400 font-mono">
                +{parsed.tags.length - maxCompactBadges} opsi
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // FULL CARD VARIANT (For modals & expanded accordion views)
  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden font-sans">
      {/* Parameter Metric Badges Header */}
      <div className="bg-slate-50/90 p-3.5 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {tanaman && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-900 text-xs font-bold border border-emerald-300/60">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Komoditas: {tanaman}</span>
            </div>
          )}

          {luas && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-300/60">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>Luas: {luas}</span>
            </div>
          )}

          {usia && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100/80 text-purple-900 text-xs font-bold border border-purple-300/60">
              <Calendar className="w-3.5 h-3.5 text-purple-700" />
              <span>Usia: {usia}</span>
            </div>
          )}

          {peserta && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100/80 text-blue-900 text-xs font-bold border border-blue-300/60">
              <span>Peserta: {peserta} Orang</span>
            </div>
          )}

          {parsed.severity && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                parsed.severity.toLowerCase().includes('berat')
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : parsed.severity.toLowerCase().includes('sedang')
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Tingkat Serangan: {parsed.severity}</span>
            </div>
          )}
        </div>

        {/* GPS Link Button */}
        {parsed.gpsCoords && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsed.gpsCoords)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Lihat Lokasi GPS ({parsed.gpsCoords})</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        )}
      </div>

      {/* Main Narrative Card with Left Accent */}
      <div className="p-4 space-y-3">
        <div className="border-l-3 border-emerald-600 pl-3.5 py-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Uraian Masalah / Permohonan Petani:
          </span>
          <p className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {parsed.narrative || rincian.replace(/\[[^\]]+\]:\s*/g, '')}
          </p>
        </div>

        {/* Tag List Pills */}
        {parsed.tags.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Pilihan Gejala / Kategori Terpilih:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {parsed.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-200/80 flex items-center gap-1"
                >
                  <Tag className="w-3 h-3 text-emerald-600" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown of other parameters toggle */}
        {parsed.fields.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowFull(!showFull)}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{showFull ? 'Sembunyikan' : 'Lihat'} Seluruh Parameter Teknis Form ({parsed.fields.length})</span>
              {showFull ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showFull && (
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 animate-in fade-in duration-150">
                {parsed.fields.map((f, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                    <span className="font-semibold text-slate-600">{f.label}:</span>
                    <span className="font-mono text-slate-900 text-right">{f.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
