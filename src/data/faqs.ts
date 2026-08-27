/**
 * ---------------------------------------------------------------------------
 * FREQUENTLY ASKED QUESTIONS
 * ---------------------------------------------------------------------------
 * ── What may be written here, and what may not ────────────────────────────
 * These answers describe GENERAL PRACTICE — what an inspection period is, what
 * a title company does, how a listing reaches the portals. That is background
 * a visitor can check anywhere, and getting it broadly right is useful.
 *
 * They must NOT state, or imply:
 *   - a fee, a commission, a rate or any figure;
 *   - a firm policy ("we always…", "we never…", "we respond within…");
 *   - a legal requirement stated as settled law;
 *   - a timescale, a guarantee or an outcome;
 *   - anything specific to a building, association or neighbourhood.
 *
 * Every answer carries `reviewed`. It is `false` on everything drafted here,
 * which means: written from general practice, NOT yet confirmed by Martin or
 * MaryEllen. The page says so in public rather than hiding it, and each answer
 * ends by pointing at a person — because the real answer depends on the
 * property (PROJECT_CONTEXT.md §9, CONTENT_PENDING.md 10.2).
 *
 * Setting `reviewed: true` on an entry removes it from that caveat. Do not set
 * it without the client having actually read the answer.
 * ---------------------------------------------------------------------------
 */

export type FaqCategory =
  | 'buying'
  | 'selling'
  | 'listings'
  | 'relocation'
  | 'website';

export type Faq = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly category: FaqCategory;
  /**
   * True only once Martin or MaryEllen has read and approved the answer.
   * False means "general practice, drafted, not confirmed" — and the page
   * says as much.
   */
  readonly reviewed: boolean;
};

export const FAQ_CATEGORIES: readonly {
  readonly id: FaqCategory;
  readonly label: string;
  readonly description: string;
}[] = [
  {
    id: 'buying',
    label: 'Buying',
    description: 'How a purchase runs, and what each stage is for.',
  },
  {
    id: 'selling',
    label: 'Selling',
    description: 'Preparing, pricing and getting a property to closing.',
  },
  {
    id: 'listings',
    label: 'Listings',
    description: 'Where property information comes from and how current it is.',
  },
  {
    id: 'relocation',
    label: 'Relocation',
    description: 'Moving to South Florida from somewhere else.',
  },
  {
    id: 'website',
    label: 'Website and property search',
    description: 'Using the search, saving properties and what we do with your details.',
  },
];

export const faqs: readonly Faq[] = [
  /* ------------------------------------------------------------------ Buying */
  {
    id: 'buy-first-step',
    category: 'buying',
    reviewed: false,
    question: 'What is the first thing I should do?',
    answer:
      'Two things, in parallel: work out what you are actually looking for, and speak to a lender. Separating what you need from what you would like narrows a search quickly, and a lender tells you what you can borrow and what it costs monthly. Sellers in South Florida generally expect a pre-approval alongside an offer, so that conversation comes before serious viewing rather than after it.',
  },
  {
    id: 'buy-agent-cost',
    category: 'buying',
    reviewed: false,
    question: 'What does it cost me to work with a buyer’s agent?',
    answer:
      'How buyer representation is paid for changed across the United States in 2024, and the arrangement is now set out in a written agreement between you and the agent before you start touring. What that agreement says varies, so the honest answer is that it is a conversation rather than a number on a web page. Ask Martin or MaryEllen to walk you through it before you commit to anything.',
  },
  {
    id: 'buy-preapproval',
    category: 'buying',
    reviewed: false,
    question: 'Is a pre-approval the same as being approved?',
    answer:
      'No. A pre-approval is a lender’s assessment based on what you have told them and what they have verified so far. Full approval comes later, after the property is appraised and the file is underwritten. Things that change between the two — a new credit line, a job change, a large deposit from an unexplained source — can affect the outcome, which is why lenders ask you not to do any of them mid-purchase.',
  },
  {
    id: 'buy-inspection',
    category: 'buying',
    reviewed: false,
    question: 'What happens during the inspection period?',
    answer:
      'Florida contracts typically give a buyer a defined window to inspect the property and decide whether to proceed. You arrange the inspections; what they turn up is often negotiable. The length of that window and exactly what it entitles you to are contract terms, so they vary from deal to deal — read yours, and ask about anything in it you are not clear on.',
  },
  {
    id: 'buy-condo-documents',
    category: 'buying',
    reviewed: false,
    question: 'Why does everyone say to read the condominium documents?',
    answer:
      'Because they tell you what the building actually costs to live in and what shape it is in — the association’s finances and reserves, the rules on renting or pets, and any assessment that has been levied or is being discussed. Two identical units in different buildings can be very different propositions once those documents are read, and it is the part of a condominium purchase people most often skip.',
  },
  {
    id: 'buy-insurance',
    category: 'buying',
    reviewed: false,
    question: 'When should I look at insurance?',
    answer:
      'Earlier than most people do. In Florida, insurance can change what a property costs to own rather than to buy, and it varies by roof age, construction, elevation and flood zone. Getting quotes while you still have the option to walk away is worth more than getting them after everything else is settled. Flood coverage is separate from homeowners insurance.',
  },

  /* ----------------------------------------------------------------- Selling */
  {
    id: 'sell-worth',
    category: 'selling',
    reviewed: false,
    question: 'How do I find out what my home is worth?',
    answer:
      'Ask for an opinion of value. Martin or MaryEllen look at the property and at what genuinely comparable homes nearby have sold for — not what they are asking — and explain the reasoning. There is no cost and no obligation to list. This website does not calculate a value for your home and never will; a number generated from public records cannot see a renovation, a new roof or the state of your association.',
  },
  {
    id: 'sell-appraisal-difference',
    category: 'selling',
    reviewed: false,
    question: 'Is that the same as an appraisal?',
    answer:
      'No. An appraisal is carried out by a licensed appraiser, usually for a lender, and follows a defined standard. An opinion of value from an agent is a considered view of what a property should be marketed at. They are different documents for different purposes, and a lender will not accept the second in place of the first.',
  },
  {
    id: 'sell-price-high',
    category: 'selling',
    reviewed: false,
    question: 'What happens if I price it high and see what happens?',
    answer:
      'Usually the same thing: the property draws its largest audience in its first week, spends that week proving to buyers that something else is better value, and then reduces — to an audience that has already moved on. Pricing from what sold rather than from what is asking tends to end better, though every property and every seller’s circumstances differ.',
  },
  {
    id: 'sell-repairs',
    category: 'selling',
    reviewed: false,
    question: 'Should I make repairs before listing?',
    answer:
      'Some work returns more than it costs and plenty does not, so it is worth going through the property with someone before spending anything. Broadly, the aim is to remove the objections that would cost more at the negotiating table than they cost to fix — not to renovate for a buyer whose taste you do not know.',
  },
  {
    id: 'sell-showings',
    category: 'selling',
    reviewed: false,
    question: 'How are showings handled?',
    answer:
      'Booked through us with notice, so you are not answering the door to strangers or losing an evening at short notice. Some properties show better accompanied — a renovation that needs explaining, a view at a particular hour — and others show better empty. Feedback from agents and buyers is passed on plainly, including the parts you may not want to hear.',
  },

  /* ---------------------------------------------------------------- Listings */
  {
    id: 'listings-where-from',
    category: 'listings',
    reviewed: false,
    question: 'Where does the property information on this site come from?',
    answer:
      'From the multiple listing service, once the feed is connected. Nothing on this site is typed in by hand, and nothing is copied from another website. Until the feed is live the property pages say so plainly rather than showing sample properties — a fabricated listing on a real estate site is a legal problem, not a design one.',
  },
  {
    id: 'listings-how-current',
    category: 'listings',
    reviewed: false,
    question: 'How current is it?',
    answer:
      'Feeds refresh on a schedule set by the provider, so there is always some lag between a change and this site showing it. Anything that matters — whether a property is still available, whether an offer is in, whether the price has moved — is worth confirming with a call before you rely on it.',
  },
  {
    id: 'listings-not-found',
    category: 'listings',
    reviewed: false,
    question: 'I saw a property elsewhere that is not on this site. Can you help with it?',
    answer:
      'Almost always, yes. Most properties listed on the multiple listing service can be shown by any participating agent, whichever brokerage holds the listing. Send the address or the listing number and we will tell you what we can find out about it.',
  },
  {
    id: 'listings-new-construction',
    category: 'listings',
    reviewed: false,
    question: 'Why do new developments work differently?',
    answer:
      'Because new construction has no equivalent of a resale feed. Pre-construction projects release inventory on their own schedule, often through relationships rather than the open market, and published details change as a project progresses. The developments pages here carry only what a developer has actually published, and floor plans are never redrawn or approximated.',
  },

  /* -------------------------------------------------------------- Relocation */
  {
    id: 'relo-where-to-start',
    category: 'relocation',
    reviewed: false,
    question: 'I am moving from out of state. Where do I start?',
    answer:
      'With the area rather than the house. Narrowing to two or three areas before you book a trip means the visit is spent deciding rather than orienting — which matters, because most people get one or two visits. MaryEllen Closius P.A. is a Relocation Specialist and this is the part of the process she works on.',
  },
  {
    id: 'relo-rent-or-buy',
    category: 'relocation',
    reviewed: false,
    question: 'Should I rent first or buy straight away?',
    answer:
      'It depends on how well you know the area and how permanent the move is. Renting for a year buys you real information about traffic, noise and whether you use the beach as much as you expected, at the cost of a year of ownership. Buying directly saves a move and a second round of paperwork, but is harder to undo if the area turns out to be wrong.',
  },
  {
    id: 'relo-florida-different',
    category: 'relocation',
    reviewed: false,
    question: 'What is different about buying in Florida?',
    answer:
      'Mostly the things attached to the property rather than the property itself: insurance, flood zones, hurricane requirements, and condominium or association finances. None of it is obvious if you have not bought here before, and some of it changes the monthly cost significantly. Ask about it early rather than at the inspection stage.',
  },
  {
    id: 'relo-remote',
    category: 'relocation',
    reviewed: false,
    question: 'Can I do any of this remotely?',
    answer:
      'A good deal of it. Video walkthroughs, remote document signing and remote closing are all common, and were normal here well before they were normal elsewhere. What is genuinely worth doing in person is seeing the area — a street is very difficult to judge from a screen.',
  },

  /* ----------------------------------------------------------------- Website */
  {
    id: 'web-search-filters',
    category: 'website',
    reviewed: false,
    question: 'Can I share a search with someone?',
    answer:
      'Yes. Every filter you set is carried in the page address, so copying the URL and sending it gives the other person exactly the same results. That works for anyone you are buying with, and it is usually easier than describing what you filtered on.',
  },
  {
    id: 'web-saved-properties',
    category: 'website',
    reviewed: false,
    question: 'Where are my saved properties stored?',
    answer:
      'In your own browser, on the device you saved them on. That means they are not visible to us and will not follow you to another device or survive clearing your browser data. A signed-in account that syncs across devices arrives with the property search itself.',
  },
  {
    id: 'web-what-happens-to-details',
    category: 'website',
    reviewed: false,
    question: 'What happens to the details I put in a form?',
    answer:
      'They go to Martin and MaryEllen so they can reply to you. They are not sold, and they are not used to sign you up to anything you did not ask for. The privacy policy sets out the detail, and there is no pre-ticked box anywhere on this site that opts you into marketing.',
  },
  {
    id: 'web-no-estimates',
    category: 'website',
    reviewed: false,
    question: 'Why does this site not show a home value estimate?',
    answer:
      'Because an automated estimate is a statistical model over recorded sales, and it cannot see the things that actually move a valuation — an unpermitted renovation, a new roof, a tenant in place, the state of an association. Rather than publish a figure that looks authoritative and is not, we would rather you asked a person who can look at the property.',
  },
  {
    id: 'web-mortgage-calculator',
    category: 'website',
    reviewed: false,
    question: 'Is the mortgage calculator a quote?',
    answer:
      'No. It applies the standard amortisation formula to the numbers you type, including the interest rate — this site does not hold a market rate and does not fetch one. It is an estimate for planning, not an offer of credit, and it excludes mortgage insurance, flood insurance and closing costs. Your lender’s figures are the ones that count.',
  },
];

/** Only what a client has actually confirmed carries no caveat. */
export const reviewedFaqs = (): readonly Faq[] => faqs.filter((f) => f.reviewed);

export const faqsByCategory = (category: FaqCategory): readonly Faq[] =>
  faqs.filter((f) => f.category === category);

/** True while any published answer is still awaiting client review. */
export const hasUnreviewedFaqs = (): boolean => faqs.some((f) => !f.reviewed);
