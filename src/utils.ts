import * as Elementa from '../../Elementa';

/**
 * @typedef {number | string | Elementa.GeneralConstraint} Size 
 */
/**
 * @typedef {{
 *  x?: Size,
 *  y?: Size,
 *  w?: Size,
 *  h?: Size,
 *  effects?: Elementa.Effect[],
 * }} BasicProps 
 */
/**
 * @typedef {{
 *  children?: (undefined | string | Elementa.UIComponent)[],
 *  stackVertical?: boolean,
 *  stackHorizontal?: boolean,
 * }} Children 
 */

const getScreenWidth = () => new (Java.type('net.minecraft.client.gui.ScaledResolution'))(Client.getMinecraft()).func_78327_c();
const getScreenHeight = () => new (Java.type('net.minecraft.client.gui.ScaledResolution'))(Client.getMinecraft()).func_78324_d();
const getScreenMin = () => Math.min(getScreenWidth(), getScreenHeight());
const getScreenMax = () => Math.max(getScreenWidth(), getScreenHeight());

/**
 * @param {string | number | Elementa.GeneralConstraint} val 
 * @param {number=} multi 
 * @returns {Elementa.GeneralConstraint}
 */
export const parseNumeric = (val, multi = 1) => {
  if(typeof val === 'string'){
    val = val.toLowerCase();
    if(val === 'center') return new Elementa.CenterConstraint();
    if(val.endsWith('px')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 2)) * multi);
    if(val.endsWith('%')) return new Elementa.RelativeConstraint(multi * Number(val.substring(0, val.length-1)) / 100);
    if(val.endsWith('vw')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 2)) * multi * getScreenWidth() / 100);
    if(val.endsWith('vh')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 2)) * multi * getScreenHeight() / 100);
    if(val.endsWith('vmin')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 4)) * multi * getScreenMin() / 100);
    if(val.endsWith('vmax')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 4)) * multi * getScreenMax() / 100);
    return new Elementa.PixelConstraint(Number(val)*multi);
  }
  if(typeof val === 'number') return new Elementa.PixelConstraint(val*multi);
  return val;
}

/**
 * @template T
 * @template K
 * @param {T extends Record<string, any> ? T : never} props 
 * @param {K extends Record<string, number> ? K : never} keys
 * @returns {{[key in keyof T]: key extends keyof K ? Elementa.GeneralConstraint : T[key]}}
 */
export const transformSizeProps = (props, keys) => {
  const copy = {...props};
  for(let key in keys){
    if(copy[key] !== undefined) copy[key] = parseNumeric(copy[key], keys[key]);
  }
  return copy;
}

/**
 * @param {Elementa.UIComponent} elem 
 * @param {BasicProps} props 
 */
export const applyBasicProps = (elem, props) => {
  const safeProps = transformSizeProps(props, {x: 1, y: 1, w: 1, h: 1});
  if(safeProps.w) elem.setWidth(safeProps.w);
  if(safeProps.h) elem.setHeight(safeProps.h);
  if(safeProps.y) elem.setX(safeProps.x);
  if(safeProps.x) elem.setY(safeProps.y);
  if(safeProps.effects) elem.enableEffects(...safeProps.effects);
  return elem;
}

/**
 * @param {Elementa.UIComponent} elem 
 * @param {Children} props 
 */
export const adoptChildren = (elem, props) => {
  const components = (props.children || [])
    .filter(c => !!c)
    .map(c => typeof c === 'string' ? new Elementa.UIText(c) : c);
  if(props.stackHorizontal) components.forEach(c => c.setX(new Elementa.SiblingConstraint()));
  if(props.stackVertical) components.forEach(c => c.setY(new Elementa.SiblingConstraint()));
  return elem.addChildren(...components);
}
