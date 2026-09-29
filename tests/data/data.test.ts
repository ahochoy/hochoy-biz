import { describe, it, expect } from 'vitest';
import { z } from 'astro/zod';

import capabilities from '../../src/data/capabilities.json';
import contact from '../../src/data/contact.json';
import connect from '../../src/data/connect.json';
import companies from '../../src/data/companies.json';
import content from '../../src/data/content.json';
import cta from '../../src/data/cta.json';
import householder from '../../src/data/householder.json';
import currently from '../../src/data/currently.json';

describe('Data Integrity Smoke Tests', () => {
  it('capabilities.json contains valid items', () => {
    const CapabilitySchema = z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      colSpan: z.number().int().positive().optional(),
      rowSpan: z.number().int().positive().optional(),
    });

    const parsed = z.array(CapabilitySchema).safeParse(capabilities);
    expect(parsed.success).toBe(true);
    expect(capabilities.length).toBeGreaterThan(0);
  });

  it('contact.json contains valid contact buttons', () => {
    const ContactSchema = z.object({
      label: z.string().min(1),
      href: z.string().min(1),
      type: z.string().min(1),
    });

    const parsed = z.array(ContactSchema).safeParse(contact);
    expect(parsed.success).toBe(true);
    expect(contact.length).toBeGreaterThan(0);
  });

  it('connect.json contains valid social/profile links', () => {
    const ConnectSchema = z.object({
      icon: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      href: z.string().url(),
    });

    const parsed = z.array(ConnectSchema).safeParse(connect);
    expect(parsed.success).toBe(true);
    expect(connect.length).toBeGreaterThan(0);
  });

  it('companies.json contains valid company logos/entries', () => {
    const CompanySchema = z.object({
      name: z.string().min(1),
      logoUrl: z.string(),
    });

    const parsed = z.array(CompanySchema).safeParse(companies);
    expect(parsed.success).toBe(true);
    expect(companies.length).toBeGreaterThan(0);
  });

  it('content.json contains valid newsletter configuration', () => {
    const ContentSchema = z.object({
      name: z.string().min(1),
      wordmark: z.string().min(1),
      description: z.string().min(1),
      cadence: z.string().min(1),
      latestHref: z.string().url(),
      subscribeHref: z.string().url(),
    });

    const parsed = ContentSchema.safeParse(content);
    expect(parsed.success).toBe(true);
  });

  it('householder.json contains valid project details', () => {
    const HouseholderSchema = z.object({
      name: z.string().min(1),
      icon: z.string().min(1),
      screenshot: z.string().min(1),
      status: z.string().min(1),
      headline: z.string().min(1),
      description: z.string().min(1),
      ctaLabel: z.string().min(1),
      href: z.string().url(),
      domain: z.string().min(1),
    });

    const parsed = HouseholderSchema.safeParse(householder);
    expect(parsed.success).toBe(true);
  });

  it('cta.json contains valid call to action entries', () => {
    const CtaSchema = z.object({
      icon: z.string().min(1),
      title: z.string().min(1),
      description: z.string().min(1),
      href: z.string().min(1),
      comingSoon: z.boolean().optional(),
    });

    const parsed = z.array(CtaSchema).safeParse(cta);
    expect(parsed.success).toBe(true);
  });

  it('currently.json contains valid current project details', () => {
    const CurrentlySchema = z.object({
      name: z.string().min(1),
      logo: z.string().min(1),
      role: z.string().min(1),
      tagline: z.string().min(1),
      ctaLabel: z.string().min(1),
      href: z.string().url(),
    });

    const parsed = CurrentlySchema.safeParse(currently);
    expect(parsed.success).toBe(true);
  });
});
