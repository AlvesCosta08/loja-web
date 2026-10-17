import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('deve renderizar o texto passado como children', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByRole('button', { name: /clique aqui/i })).toBeInTheDocument();
  });

  it('deve disparar a função onClick quando clicado', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Salvar</Button>);
    
    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('deve estar desabilitado quando a prop disabled for true', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Cancelar</Button>);
    
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});