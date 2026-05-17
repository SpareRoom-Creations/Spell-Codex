import { motion } from "framer-motion";
import { Spell } from "@/data/spells";
import { X, BookOpen, Clock, Ruler, Hourglass, Target, Zap, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function SpellModal({ spell, onClose }: { spell: Spell; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col parchment-texture border border-card-border rounded-lg shadow-2xl overflow-hidden z-10"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-secondary/80 to-primary/80" />
        
        <div className="flex items-start justify-between p-6 pb-4 border-b border-card-border/50 bg-black/5">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-1">{spell.name}</h2>
            <div className="flex items-center gap-2 text-sm font-serif italic text-muted-foreground">
              <span>{spell.class}</span>
              <span>•</span>
              <span>Level {spell.level}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground hover:bg-black/10 rounded-full h-8 w-8 -mr-2 -mt-2">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8 bg-background/40 p-4 rounded border border-card-border/50">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Ruler className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold font-mono">Range</div>
                    <div className="text-sm font-medium">{spell.range}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Hourglass className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold font-mono">Duration</div>
                    <div className="text-sm font-medium">{spell.duration}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold font-mono">Area of Effect</div>
                    <div className="text-sm font-medium">{spell.areaOfEffect}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold font-mono">Casting Time</div>
                    <div className="text-sm font-medium">{spell.castingTime}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold font-mono">Saving Throw</div>
                    <div className="text-sm font-medium">{spell.savingThrow}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold font-mono">Components</div>
                    <div className="flex gap-1 mt-0.5">
                      {spell.components.split(',').map((c, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-background/50 border-card-border font-mono">
                          {c.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="prose prose-sm sm:prose-base max-w-none text-foreground prose-headings:font-serif prose-headings:text-primary leading-relaxed font-sans">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:-mt-1 first-letter:float-left first-letter:leading-[0.8]">
                {spell.description}
              </p>
            </div>
            
            <div className="mt-10 pt-4 border-t border-card-border/50 flex items-center justify-end text-xs text-muted-foreground font-mono">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-secondary" />
              Players Handbook, Page {spell.phbPage}
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
}