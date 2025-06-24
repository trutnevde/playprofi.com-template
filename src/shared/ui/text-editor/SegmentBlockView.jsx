// src/shared/ui/text-editor/SegmentBlockView.jsx
function SegmentBlockView({ text }) {
    return (
        <div className="rounded-xl p-3 bg-dark-graphite text-white hover:bg-main-accent/20 cursor-pointer transition-colors duration-200">
        {text}
      </div>
    );
  }
  
  export default SegmentBlockView;