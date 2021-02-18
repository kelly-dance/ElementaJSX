import { adoptChildren, applyBasicProps, BasicProps, Children, Size, transformSizeProps } from './utils';
import * as Elementa from '../../Elementa';

export const UIContainer = (
  props: BasicProps<Elementa.UIContainer> & Children
): Elementa.UIContainer => {
  const elem = new Elementa.UIContainer();
  applyBasicProps(elem, props);
  adoptChildren(elem, props);
  return elem;
}

export const UIText = (
  props: BasicProps<Elementa.UIText> & {scale?: Size, children?: string[]}
): Elementa.UIText => {
  const elem = new Elementa.UIText(props.children?.[0] || '');
  applyBasicProps(elem, props);
  const safeProps = transformSizeProps(props, {scale: 1/8});
  if(safeProps.scale) elem.setTextScale(safeProps.scale as Elementa.HeightConstraint);
  return elem;
}

export const UIImage = (
  props: BasicProps<Elementa.UIImage> & {file?: string | JavaTFile, url?: string | JavaTURL, w: Size, h: Size}
): Elementa.UIImage => {
  let elem: Elementa.UIImage;
  if(props.file) elem = Elementa.UIImage.ofFile(typeof props.file === 'string' ? new (Java.type('java.net.File'))(props.file) : props.file);
  else if(props.url) elem = Elementa.UIImage.ofURL(typeof props.url === 'string' ? new (Java.type('java.net.URL'))(props.url) : props.url);
  else throw new Error('UIImage must have a `file` or `url` prop');
  applyBasicProps(elem, props);
  return elem;
}
