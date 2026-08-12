export default function Marquee({ items }) {
  const content = items.join('   ///   ') + '   ///   ';
  return (
    <div className="marquee" data-magnetic>
      <div className="marquee-track">
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  );
}