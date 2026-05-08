import * as React from "react"
import Svg, { Defs, G, Path, SvgProps } from "react-native-svg"
const IcontBack = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <G fill={props.fill} fillRule="evenodd" clipRule="evenodd" filter="url(#a)">
      <Path d="M25.78 3.337a1.333 1.333 0 0 1 2.22.996v21.334a1.333 1.333 0 0 1-2.22.996l-12-10.666a1.334 1.334 0 0 1 0-1.993l12-10.667ZM10.667 3C11.403 3 12 3.597 12 4.333v21.334c0 .736-.597 1.333-1.333 1.333H5.333A1.333 1.333 0 0 1 4 25.667V4.333C4 3.597 4.597 3 5.333 3h5.334Z" />
    </G>
    <Defs></Defs>
  </Svg>
)
export default IcontBack
