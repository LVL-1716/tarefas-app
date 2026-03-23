import { render } from '@testing-library/react';
import WhatsAppButton from './WhatsAppButton';

describe('WhatsAppButton', () => {
  it('renders correctly', () => {
    const { container } = render(<WhatsAppButton phoneNumber="5511999999999" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});