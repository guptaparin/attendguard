import { describe, it, expect } from 'vitest';
import { validate, normalizeName } from './components/SubjectForm.jsx';

const ok = { name: 'Digital Electronics', held: '40', attended: '36' };

describe('validate — prd.md > States and Boundaries (invalid input)', () => {
  it('accepts clean input', () => expect(validate(ok)).toBeNull());
  it('rejects an empty or blank name', () => expect(validate({ ...ok, name: '   ' }).field).toBe('name'));
  it('rejects a name with no letters or numbers', () => expect(validate({ ...ok, name: '---' }).field).toBe('name'));
  it('rejects duplicates, ignoring case and extra spaces', () => {
    expect(validate({ ...ok, name: '  digital   electronics ' }, ['Digital Electronics']).message).toMatch(/already have/);
  });
  it('allows the same name when editing that subject (caller excludes it)', () => expect(validate(ok, [])).toBeNull());
  it('rejects negative, decimal and non-numeric counts', () => {
    expect(validate({ ...ok, held: '-1' }).field).toBe('held');
    expect(validate({ ...ok, held: '40.5' }).field).toBe('held');
    expect(validate({ ...ok, attended: 'abc' }).field).toBe('attended');
  });
  it('rejects code-like input in number fields', () => {
    expect(validate({ ...ok, held: "1; DROP TABLE subjects" }).field).toBe('held');
  });
  it('rejects implausible class counts', () => expect(validate({ ...ok, held: '1200', attended: '10' }).field).toBe('held'));
  it('rejects attended > held', () => expect(validate({ ...ok, held: '10', attended: '12' }).field).toBe('attended'));
  it('normalizes whitespace in names', () => expect(normalizeName('  Signals   &  Systems ')).toBe('Signals & Systems'));
});
