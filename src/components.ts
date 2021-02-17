import { adoptChildren, applyBasicProps, transformSizeProps } from './utils';
import * as Elementa from '../../Elementa';

/**
 * @param {import('./utils').BasicProps & import('./utils').Children} props 
 */
export const UIContainer = props => {
  const elem = new Elementa.UIContainer();
  applyBasicProps(elem, props);
  adoptChildren(elem, props);
  return elem;
}

/**
 * @param {import('./utils').BasicProps & {scale?: import('./utils').Size} & {children: string[]}} props 
 */
export const UIText = props => {
  const elem = new Elementa.UIText(props.children[0] || '');
  applyBasicProps(elem, props);
  const safeProps = transformSizeProps(props, {scale: 1/8});
  if(safeProps.scale) elem.setTextScale(safeProps.scale);
  return elem;
}

/**
 * @param {import('./utils').BasicProps & {file?: string | JavaTFile, url?: string | JavaTURL, w: import('./utils').Size, h: import('./utils').Size}} props 
 */
export const UIImage = props => {
  /** @type {Elementa.UIImage} */
  let elem;
  if(props.file) elem = Elementa.UIImage.ofFile(typeof props.file === 'string' ? new (Java.type('java.net.File'))(props.file) : props.file);
  else if(props.url) elem = Elementa.UIImage.ofURL(typeof props.url === 'string' ? new (Java.type('java.net.URL'))(props.url) : props.url);
  else throw new Error('UIImage must have a `file` or `url` prop');
  applyBasicProps(elem, props);
  return elem;
}
