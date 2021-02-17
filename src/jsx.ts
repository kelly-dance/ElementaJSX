import * as Elementa from '../../Elementa';

export const createElement = (
  tag: (props: any) => Elementa.UIComponent,
  props: null | Record<string, any>,
  ...children: (string | Elementa.UIComponent)[]
): Elementa.UIComponent => {
  if(!props) props = {};
  if(!children) children = [];
  return tag({...props, children});
}
