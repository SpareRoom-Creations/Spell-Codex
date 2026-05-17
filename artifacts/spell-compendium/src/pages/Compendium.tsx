import { useState, useMemo } from "react";
import { Search, Book } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { spells, Spell } from "@/data/spells";
import SpellCard from "@/components/SpellCard";
import SpellModal from "@/components/SpellModal";
import { AnimatePresence } from "framer-motion";

const CLASSES = ["Magic User", "Cleric", "Ranger", "Illusionist", "Druid", "Paladin"];
const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Compendium() {
  const [search, setSearch] = useState("");
  const [activeClass, setActiveClass] = useState("Magic User");
  const [selectedLevel, setSelectedLevel] = useState<number | "All">("All");
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  const filteredSpells = useMemo(() => {
    return spells.filter(spell => {
      if (spell.class !== activeClass) return false;
      if (selectedLevel !== "All" && spell.level !== selectedLevel) return false;
      if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, activeClass, selectedLevel]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans dark-leather">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur z-10 sticky top-0 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-serif font-bold text-primary tracking-wider drop-shadow-sm">Spell Compendium</h1>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search spells by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card/10 border-border focus-visible:ring-secondary text-foreground parchment-texture font-serif placeholder:font-serif"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 flex flex-col gap-4">
          <Tabs value={activeClass} onValueChange={setActiveClass} className="w-full">
            <TabsList className="bg-transparent border-b border-border w-full justify-start h-auto p-0 gap-6 rounded-none overflow-x-auto overflow-y-hidden pb-[1px]">
              {CLASSES.map(cls => (
                <TabsTrigger 
                  key={cls} 
                  value={cls}
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none py-2 px-1 font-serif text-lg text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {cls}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2 pb-2 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setSelectedLevel("All")}
              className={`px-4 py-1.5 rounded-sm border font-serif text-sm transition-all whitespace-nowrap ${selectedLevel === "All" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card/10 text-muted-foreground border-border hover:bg-card/20 hover:text-foreground"}`}
            >
              All Levels
            </button>
            {LEVELS.map(lvl => (
              <button 
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-1.5 rounded-sm border font-serif text-sm transition-all whitespace-nowrap ${selectedLevel === lvl ? "bg-secondary text-secondary-foreground border-secondary shadow-sm" : "bg-card/10 text-muted-foreground border-border hover:bg-card/20 hover:text-foreground"}`}
              >
                Level {lvl}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        {activeClass === "Magic User" ? (
          <ScrollArea className="flex-1 h-full whitespace-nowrap">
            <div className="flex p-6 gap-6 h-full items-start w-max">
              {LEVELS.map(level => {
                if (selectedLevel !== "All" && selectedLevel !== level) return null;
                
                const levelSpells = filteredSpells.filter(s => s.level === level);
                if (levelSpells.length === 0 && search) return null;

                return (
                  <div key={level} className="w-[320px] flex-shrink-0 flex flex-col h-[calc(100vh-250px)] rounded-md border border-card-border bg-card/60 parchment-texture shadow-lg">
                    <div className="p-3.5 border-b border-card-border/50 bg-black/5 flex justify-between items-center sticky top-0 z-10 rounded-t-md">
                      <h2 className="font-serif font-bold text-xl text-primary drop-shadow-sm">Level {level}</h2>
                      <span className="text-xs font-mono bg-background/40 text-foreground px-2 py-1 rounded-sm border border-card-border/50">{levelSpells.length} spells</span>
                    </div>
                    <ScrollArea className="flex-1 p-3.5">
                      <div className="flex flex-col gap-3.5 pb-4">
                        {levelSpells.length > 0 ? (
                          levelSpells.map(spell => (
                            <SpellCard key={spell.id} spell={spell} onClick={() => setSelectedSpell(spell)} />
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center opacity-70">
                            <Book className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="text-muted-foreground text-sm font-serif">No spells found matching your criteria.</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" className="bg-background/50 border-t border-border" />
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-md w-full text-center p-10 parchment-texture border-2 border-card-border rounded-lg shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
               <Book className="w-12 h-12 mx-auto mb-6 text-primary/80 drop-shadow-sm" />
               <h2 className="font-serif text-3xl font-bold mb-4 text-primary">Forbidden Knowledge</h2>
               <p className="text-muted-foreground font-serif italic mb-8 text-lg">The tomes detailing the incantations of the {activeClass} have been lost to time... for now.</p>
               <div className="inline-flex items-center justify-center px-4 py-2 border border-secondary text-secondary rounded-sm font-mono text-xs tracking-widest uppercase bg-secondary/10 font-bold">
                 Coming Soon
               </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <AnimatePresence>
        {selectedSpell && (
          <SpellModal spell={selectedSpell} onClose={() => setSelectedSpell(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}