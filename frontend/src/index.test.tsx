import { describe, it, expect, vi, beforeEach } from 'vitest';

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({
  render: renderMock,
}));

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: createRootMock,
  },
}));

vi.mock('react-redux', () => ({
  Provider: ({ children }: any) => <div data-testid="provider">{children}</div>,
}));

vi.mock('./components/app/app', () => ({
  default: () => <div data-testid="app" />,
}));

vi.mock('./store', () => ({
  store: {},
}));

describe('main entry file', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should create root and render app when #root exists (equivalence: root exists)', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('./index');

    expect(createRootMock).toHaveBeenCalled();
    expect(renderMock).toHaveBeenCalled();
  });

  it('should not create root if #root does not exist (equivalence: root отсутствует)', async () => {
    document.body.innerHTML = '';

    await import('./index');

    expect(createRootMock).not.toHaveBeenCalled();
    expect(renderMock).not.toHaveBeenCalled();
  });
});
