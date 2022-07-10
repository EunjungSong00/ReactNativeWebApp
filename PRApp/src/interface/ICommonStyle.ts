import {
  MarginProps,
  PaddingProps,
  ColorProps,
  WidthProps,
  MinWidthProps,
  MaxWidthProps,
  HeightProps,
  MaxHeightProps,
  MinHeightProps,
  FlexDirectionProps,
  BorderRadiusProps,
  BackgroundProps,
  DisplayProps,
  JustifyContentProps,
  VerticalAlignProps,
  AlignItemsProps,
  BorderProps
} from 'styled-system';

export default interface ICommonStyle
  extends MarginProps,
    PaddingProps,
    ColorProps,
    WidthProps,
    MinWidthProps,
    MaxWidthProps,
    MinHeightProps,
    MaxHeightProps,
    HeightProps,
    FlexDirectionProps,
    BorderRadiusProps,
    BackgroundProps,
    DisplayProps,
    JustifyContentProps,
    AlignItemsProps,
    BorderProps,
    VerticalAlignProps {
  color?: string;
  position?: string;
}
