import * as React from 'react';

import { MainRouter } from '@/router/main-router';
import { Modal } from '@/shared/components/modals/modal.component';
import { Toaster } from 'react-hot-toast';

const App = (): React.ReactNode => {
  return (
    <>
      <MainRouter />
      <Modal />
      <Toaster position="top-right" data-testid="toast-container" />
    </>
  );
};

export default App;
