'use client';
import React, { useState, useMemo } from 'react';
import { GLModal } from '@/components/gl/GLModal';
import { getRelationshipsForCM } from '@/data/mock/sharedCmData';

interface SharedCmToolProps {
  open: boolean;
  onClose: () => void;
  initialCM?: number;
}

export function SharedCmTool({ open, onClose, initialCM }: SharedCmToolProps) {
  const [cmValue, setCmValue] = useState(initialCM?.toString() || '');

  const results = useMemo(() => {
    const num = parseFloat(cmValue);
    if (isNaN(num) || num <= 0) return [];
    return getRelationshipsForCM(num);
  }, [cmValue]);

  const maxProb = Math.max(...results.map(r => r.probability), 0);

  return (
    <GLModal open={open} onClose={onClose} title="Shared cM Relationship Tool" size="lg">
      <div>
        <p style={{ fontSize: 13, color: '#5a6f86', margin: '0 0 16px' }}>
          Enter a shared cM value to see possible relationships and their probabilities.
        </p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input
            type="number"
            placeholder="Enter cM value..."
            value={cmValue}
            onChange={(e) => setCmValue(e.target.value)}
            style={{
              flex: 1, padding: '10px 14px', border: '1px solid #dce2ea',
              borderRadius: 8, fontSize: 16, outline: 'none',
              fontWeight: 600,
            }}
            autoFocus
          />
          <div style={{
            padding: '10px 14px', background: '#f5f8fc', borderRadius: 8,
            fontSize: 14, color: '#5a6f86', display: 'flex', alignItems: 'center',
          }}>
            cM shared
          </div>
        </div>

        {results.length > 0 ? (
          <div>
            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#2d3e52' }}>
              Possible Relationships
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {results.map((result, i) => (
                <div key={result.relationship} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '8px 12px', borderRadius: 8,
                  background: i === 0 ? '#f0f6ff' : 'transparent',
                }}>
                  {/* Relationship name */}
                  <div style={{
                    width: 200, fontSize: 13, color: '#2d3e52',
                    fontWeight: i === 0 ? 600 : 400, flexShrink: 0,
                  }}>
                    {result.relationship}
                  </div>

                  {/* Probability bar */}
                  <div style={{ flex: 1, height: 20, background: '#edf1f5', borderRadius: 4, position: 'relative' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      width: `${(result.probability / maxProb) * 100}%`,
                      background: i === 0 ? '#4582c9' :
                        result.probability > 0.2 ? '#7abf43' :
                        result.probability > 0.05 ? '#ffb300' : '#dce2ea',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>

                  {/* Probability percentage */}
                  <div style={{
                    width: 50, textAlign: 'right', fontSize: 13,
                    fontWeight: 600, color: i === 0 ? '#4582c9' : '#5a6f86',
                  }}>
                    {(result.probability * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Range info for top result */}
            {results[0] && (
              <div style={{
                marginTop: 16, padding: '12px 16px', background: '#f5f8fc',
                borderRadius: 8, fontSize: 12, color: '#5a6f86',
              }}>
                <strong>Most likely: {results[0].relationship}</strong>
                <br />
                Typical range: {results[0].minCM}–{results[0].maxCM} cM
                (average: {results[0].avgCM} cM)
              </div>
            )}
          </div>
        ) : cmValue && parseFloat(cmValue) > 0 ? (
          <div style={{
            padding: 24, textAlign: 'center', color: '#9baab9', fontSize: 14,
          }}>
            No matching relationships found for {cmValue} cM
          </div>
        ) : (
          <div style={{
            padding: 24, textAlign: 'center', color: '#9baab9', fontSize: 14,
          }}>
            Enter a cM value above to see relationship probabilities
          </div>
        )}
      </div>
    </GLModal>
  );
}
