import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HomePage } from './home.page';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as boardService from '@/shared/services/board.service';
import { Modal } from '@/shared/components/modals/modal.component';
import { Toaster } from 'react-hot-toast';
import BoardPage from '../board/board.page';

describe('HomePage', () => {
  it('renders input and buttons', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </QueryClientProvider>,
    );
    expect(
      screen.getByPlaceholderText(/enter board hashID/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/find/i)).toBeInTheDocument();
    expect(screen.getByText(/create board/i)).toBeInTheDocument();
  });

  it('shows all boards received from getAll', async () => {
    const boards = [
      { id: '1', name: 'Board One', hashId: 'hash1' },
      { id: '2', name: 'Board Two', hashId: 'hash2' },
      { id: '3', name: 'Board Three', hashId: 'hash3' },
    ];
    vi.spyOn(boardService.boardService, 'getAll').mockResolvedValue(boards);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    for (const board of boards) {
      expect(await screen.findByText(board.name)).toBeInTheDocument();
    }
  });

  it('adds board to ui and shows success toast', async () => {
    const getAllMock = vi.spyOn(boardService.boardService, 'getAll');
    getAllMock.mockResolvedValueOnce([]);
    getAllMock.mockResolvedValueOnce([
      { id: '1', name: 'Board One', hashId: 'hash1' },
    ]);
    vi.spyOn(boardService.boardService, 'create').mockResolvedValueOnce({
      id: '1',
      name: 'Board One',
      hashId: 'hash1',
    });

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
          <Modal />
          <Toaster position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    expect(
      screen.queryByTestId('board-item-test-hash'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('create-board-button'));
    await screen.findByText(/create a new board/i);
    const input = await screen.findByTestId('create-board-modal-name-input');
    fireEvent.change(input, { target: { value: 'Test Board' } });
    fireEvent.click(
      await screen.findByTestId('create-board-modal-create-button'),
    );

    await waitFor(() => {
      const toasts = document.querySelectorAll('[data-testid^="toast-"]');
      const lastToast = toasts[toasts.length - 1];
      expect(lastToast).toHaveTextContent('Board created successfully :)');
    });

    await waitFor(() => {
      expect(screen.getByTestId('board-item-hash1')).toBeInTheDocument();
      expect(screen.getByText('Board One')).toBeInTheDocument();
    });
  });

  it('redirects to board page according to hashId', async () => {
    vi.spyOn(boardService.boardService, 'getByHashId').mockResolvedValue({
      id: '1',
      name: 'Test Board',
      hashId: 'test-hash',
    });

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HomePage />
                  <Modal />
                  <Toaster position="top-right" />
                </>
              }
            />
            <Route path="/board/:id" element={<BoardPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    fireEvent.change(screen.getByTestId('board-hash-id-input'), {
      target: { value: 'test-hash' },
    });

    fireEvent.click(screen.getByTestId('find-board-by-hash-id-button'));

    await waitFor(() => {
      expect(screen.getByTestId('board-page')).toBeInTheDocument();
      expect(screen.getByTestId('header-title')).toHaveTextContent(
        'Test Board',
      );
    });
  });

  it('updates board and shows success toast', async () => {
    const boards = [{ id: '1', name: 'Board One', hashId: 'hash1' }];
    vi.spyOn(boardService.boardService, 'getAll').mockResolvedValue(boards);
    vi.spyOn(boardService.boardService, 'update').mockResolvedValue({
      id: '1',
      name: 'Board One Updated',
      hashId: 'hash1',
    });

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
          <Modal />
          <Toaster position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    const editButton = await screen.findByTestId('edit-board-icon-hash1');
    fireEvent.click(editButton);

    await screen.findByText(/update a board/i);
    const input = await screen.findByTestId('update-board-modal-name-input');
    fireEvent.change(input, { target: { value: 'Board One Updated' } });

    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      const toasts = document.querySelectorAll('[data-testid^="toast-"]');
      const lastToast = toasts[toasts.length - 1];
      expect(lastToast).toHaveTextContent('Board updated successfully :)');
    });
  });

  it('removes board from UI and shows success toast after delete', async () => {
    const boards = [
      { id: '1', name: 'Board One', hashId: 'hash1' },
      { id: '2', name: 'Board Two', hashId: 'hash2' },
    ];
    const getAllMock = vi.spyOn(boardService.boardService, 'getAll');
    getAllMock.mockResolvedValueOnce(boards);
    getAllMock.mockResolvedValueOnce([
      { id: '2', name: 'Board Two', hashId: 'hash2' },
    ]);
    vi.spyOn(boardService.boardService, 'delete').mockResolvedValue();

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
          <Modal />
          <Toaster position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId('board-item-hash1');
    await screen.findByTestId('board-item-hash2');
    fireEvent.click(screen.getByTestId('delete-board-icon-hash1'));
    await screen.findByText(/are you sure you want to delete a board/i);
    fireEvent.click(screen.getByTestId('delete-board-modal-submit-button'));

    await waitFor(() => {
      const toasts = document.querySelectorAll('[data-testid^="toast-"]');
      const lastToast = toasts[toasts.length - 1];
      expect(lastToast).toHaveTextContent('Board is deleted successfully.');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('board-item-hash1')).not.toBeInTheDocument();
      expect(screen.getByTestId('board-item-hash2')).toBeInTheDocument();
    });
  });

  it('navigates to board page when clicking on board-list-item', async () => {
    const boards = [{ id: '1', name: 'Board One', hashId: 'hash1' }];
    vi.spyOn(boardService.boardService, 'getAll').mockResolvedValue(boards);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HomePage />
                  <Modal />
                  <Toaster position="top-right" />
                </>
              }
            />
            <Route path="/board/:id" element={<BoardPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const boardItem = await screen.findByTestId('board-item-hash1');
    boardItem.click();
    await screen.findByTestId('board-page');
    expect(screen.getByTestId('header-title')).toHaveTextContent('Board One');
  });
});
