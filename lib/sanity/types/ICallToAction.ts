// Interface para o objeto Button
export interface IButton {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
}

// Interface para o documento Call To Action
export interface ICallToAction {
  title: string;
  description?: string;
  button: IButton;
}
