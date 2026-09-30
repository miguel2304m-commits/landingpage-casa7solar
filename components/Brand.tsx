import Image from 'next/image';

export default function Brand() {
  return <a className="brand" href="#inicio" aria-label="Casa 7 Solar Energy — início">
    <Image src="/images/casa7-logo-original.jpg" width={48} height={48} alt="" priority />
    <span className="brand-type">CASA <b>7</b> SOLAR<small>ENERGY</small></span>
  </a>;
}
