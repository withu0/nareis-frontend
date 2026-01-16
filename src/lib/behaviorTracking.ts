export interface MemberBehavior {
  pageViews: Record<string, number>;
  resourceDownloads: string[];
  eventRegistrations: string[];
  forumPosts: number;
  searchQueries: string[];
  lastActive: Date;
  interests: string[];
}

const STORAGE_KEY = 'member_behavior';

export function trackPageView(page: string) {
  const behavior = getBehavior();
  behavior.pageViews[page] = (behavior.pageViews[page] || 0) + 1;
  behavior.lastActive = new Date();
  saveBehavior(behavior);
}

export function trackResourceDownload(resourceId: string) {
  const behavior = getBehavior();
  if (!behavior.resourceDownloads.includes(resourceId)) {
    behavior.resourceDownloads.push(resourceId);
  }
  saveBehavior(behavior);
}

export function trackEventRegistration(eventId: string) {
  const behavior = getBehavior();
  if (!behavior.eventRegistrations.includes(eventId)) {
    behavior.eventRegistrations.push(eventId);
  }
  saveBehavior(behavior);
}

export function trackForumPost() {
  const behavior = getBehavior();
  behavior.forumPosts += 1;
  saveBehavior(behavior);
}

export function trackSearch(query: string) {
  const behavior = getBehavior();
  behavior.searchQueries.push(query);
  if (behavior.searchQueries.length > 50) {
    behavior.searchQueries = behavior.searchQueries.slice(-50);
  }
  saveBehavior(behavior);
}

export function getBehavior(): MemberBehavior {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    parsed.lastActive = new Date(parsed.lastActive);
    return parsed;
  }
  return {
    pageViews: {},
    resourceDownloads: [],
    eventRegistrations: [],
    forumPosts: 0,
    searchQueries: [],
    lastActive: new Date(),
    interests: []
  };
}

function saveBehavior(behavior: MemberBehavior) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(behavior));
}
