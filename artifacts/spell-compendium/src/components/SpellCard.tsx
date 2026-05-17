import { motion } from "framer-motion";
import { Spell } from "@/data/spells";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Ruler, Hourglass, Star } from "lucide-react";

interface SpellCardProps {
  spell: Spell;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function SpellCard({ spell, onClick, isFavorite, onToggleFavorite }: SpellCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      data-testid={`card-spell-${spell.id}`}
      className="bg-card border border-card-border rounded p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3 className="font-serif font-bold text-lg text-foreground leading-tight pr-2">{spell.name}</h3>
        <button
          data-testid={`button-favorite-${spell.id}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(spell.id); }}
          className={`shrink-0 p-0.5 rounded transition-colors ${isFavorite ? "text-secondary" : "text-muted-foreground/40 hover:text-secondary/70"}`}
          aria-label={isFavorite ? "Remove from spellbook" : "Add to spellbook"}
        >
          <Star className={`w-4 h-4 ${isFavorite ? "fill-secondary" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-3 text-xs text-muted-foreground relative z-10 font-medium">
        <div className="flex items-center gap-1.5">
          <Ruler className="w-3.5 h-3.5 text-secondary" />
          <span className="truncate">{spell.range}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Hourglass className="w-3.5 h-3.5 text-secondary" />
          <span className="truncate">{spell.duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-secondary" />
          <span className="truncate">{spell.castingTime}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-secondary" />
          <a
            href={`/phb.pdf#page=${spell.phbPage + 1}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            data-testid={`link-phb-${spell.id}`}
            className="text-secondary hover:text-primary underline underline-offset-2 decoration-dotted transition-colors"
          >
            PHB pg {spell.phbPage}
          </a>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1 relative z-10">
        {spell.components.split(',').map((c, i) => (
          <Badge key={i} variant="outline" className="text-[10px] h-4 px-1.5 border-card-border bg-background/30 text-foreground font-mono">
            {c.trim()}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}
