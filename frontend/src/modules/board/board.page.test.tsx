import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BoardPage from './board.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { Modal } from '@/shared/components/modals/modal.component';
import { Toaster } from 'react-hot-toast';
import * as cardService from '@/shared/services/card.service';

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useLocation: () => ({ state: { id: '1', name: 'Board One' } }),
    useNavigate: () => vi.fn(),
  };
});

describe('BoardPage - cards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderBoardPage() {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BoardPage />
          <Modal />
          <Toaster position="top-right" />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  }

  it('creates a new card, shows it in the TODO column and success toast', async () => {
    const getAllMock = vi.spyOn(cardService.cardService, 'getAll');
    getAllMock.mockResolvedValueOnce([]);

    getAllMock.mockResolvedValueOnce([
      {
        id: 'c1',
        title: 'English homework',
        description: 'Exercise 1-10',
        column: 'todo',
      },
    ]);

    vi.spyOn(cardService.cardService, 'create').mockResolvedValue({
      id: 'c1',
      title: 'New Card',
      description: 'Desc',
      column: 'todo',
    });

    renderBoardPage();

    fireEvent.click(await screen.findByTestId('add-card-button'));

    await screen.findByText(/create a new card/i);

    fireEvent.change(screen.getByPlaceholderText(/Enter title/i), {
      target: { value: 'English homework' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter description/i), {
      target: { value: 'Exercise 1-10' },
    });

    fireEvent.click(
      await screen.findByTestId('create-card-modal-create-button'),
    );

    await waitFor(() => {
      expect(screen.getByText('English homework')).toBeInTheDocument();
      const toasts = document.querySelectorAll('[data-testid^="toast-"]');
      const lastToast = toasts[toasts.length - 1];
      expect(lastToast).toHaveTextContent('Card created successfully!');
    });
  });

  it('updates a card, shows updated title and success toast', async () => {
    const getAllMock = vi.spyOn(cardService.cardService, 'getAll');
    getAllMock.mockResolvedValueOnce([
      {
        id: 'c1',
        title: 'English homework',
        description: 'Exercise 1-10',
        column: 'todo',
      },
    ]);
    getAllMock.mockResolvedValueOnce([
      {
        id: 'c1',
        title: 'Updated homework',
        description: 'Exercise 1-10',
        column: 'todo',
      },
    ]);
    vi.spyOn(cardService.cardService, 'update').mockResolvedValue({
      id: 'c1',
      title: 'Updated homework',
      description: 'Exercise 1-10',
      column: 'todo',
    });

    renderBoardPage();

    fireEvent.click(await screen.findByTestId('card-menu-c1'));
    fireEvent.click(await screen.findByTestId('card-menu-update-c1'));
    const input = await screen.findByTestId('title');
    fireEvent.change(input, { target: { value: 'Updated homework' } });
    fireEvent.click(
      await screen.findByTestId('update-card-modal-update-button'),
    );

    await waitFor(() => {
      expect(screen.getByText('Updated homework')).toBeInTheDocument();
      const toasts = document.querySelectorAll('[data-testid^="toast-"]');
      const lastToast = toasts[toasts.length - 1];
      expect(lastToast).toHaveTextContent('Card updated successfully :)');
    });
  });

  it('deletes a card, removes it from the column and shows success toast', async () => {
    const getAllMock = vi.spyOn(cardService.cardService, 'getAll');
    getAllMock.mockResolvedValueOnce([
      {
        id: 'c1',
        title: 'English homework',
        description: 'Exercise 1-10',
        column: 'todo',
      },
    ]);
    getAllMock.mockResolvedValueOnce([]);
    vi.spyOn(cardService.cardService, 'delete').mockResolvedValue();

    renderBoardPage();

    fireEvent.click(await screen.findByTestId('card-menu-c1'));
    fireEvent.click(await screen.findByTestId('card-menu-delete-c1'));
    fireEvent.click(
      await screen.findByTestId('delete-card-modal-submit-button'),
    );

    await waitFor(() => {
      expect(screen.queryByText('English homework')).not.toBeInTheDocument();
      const toasts = document.querySelectorAll('[data-testid^="toast-"]');
      const lastToast = toasts[toasts.length - 1];
      expect(lastToast).toHaveTextContent('Card is deleted successfully.');
    });
  });

  it('shows a modal with card details', async () => {
    const getAllMock = vi.spyOn(cardService.cardService, 'getAll');
    getAllMock.mockResolvedValueOnce([
      {
        id: 'c1',
        title: 'English homework',
        description: 'Exercise 1-10',
        column: 'todo',
      },
    ]);

    renderBoardPage();

    fireEvent.click(await screen.findByTestId('card-menu-c1'));
    fireEvent.click(await screen.findByTestId('card-menu-view-c1'));

    await waitFor(() => {
      const modal = screen.getByTestId('view-card-modal');
      expect(within(modal).getByText('English homework')).toBeInTheDocument();
      expect(within(modal).getByText('Exercise 1-10')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('view-card-modal-close-button');
    fireEvent.click(closeButton);
  });
});
