import { useState, useMemo } from "react";
import { Search, Book, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { spells, Spell } from "@/data/spells";
import SpellCard from "@/components/SpellCard";
import SpellModal from "@/components/SpellModal";
import { AnimatePresence } from "framer-motion";
import { useFavorites } from "@/hooks/use-favorites";

const CLASSES = ["Magic User", "Cleric", "Ranger", "Illusionist", "Druid", "Paladin"];
const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Compendium() {
  const [search, setSearch] = useState("");
  const [activeClass, setActiveClass] = useState("Magic User");
  const [selectedLevel, setSelectedLevel] = useState<number | "All">("All");
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [spellbookOnly, setSpellbookOnly] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filteredSpells = useMemo(() => {
    return spells.filter(spell => {
      if (spell.class !== activeClass) return false;
      if (selectedLevel !== "All" && spell.level !== selectedLevel) return false;
      if (search && !spell.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (spellbookOnly && !favorites.has(spell.id)) return false;
      return true;
    });
  }, [search, activeClass, selectedLevel, spellbookOnly, favorites]);

  const spellsByLevel = useMemo(() => {
    return (level: number) => {
      const all = filteredSpells.filter(s => s.level === level);
      return [
        ...all.filter(s => favorites.has(s.id)),
        ...all.filter(s => !favorites.has(s.id)),
      ];
    };
  }, [filteredSpells, favorites]);

  const totalFavorites = favorites.size;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans dark-leather">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur z-10 sticky top-0 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-serif font-bold text-primary tracking-wider drop-shadow-sm">Spell Compendium</h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              data-testid="button-spellbook-toggle"
              onClick={() => setSpellbookOnly(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm border font-serif text-sm transition-all whitespace-nowrap shrink-0 ${
                spellbookOnly
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-inner"
                  : "bg-card/10 text-muted-foreground border-border hover:bg-card/20 hover:text-foreground"
              }`}
              aria-pressed={spellbookOnly}
            >
              <Star className={`w-4 h-4 ${spellbookOnly ? "fill-secondary-foreground" : ""}`} />
              My Spellbook
              {totalFavorites > 0 && (
                <span className={`text-xs font-mono px-1.5 py-0.5 rounded-sm ${spellbookOnly ? "bg-secondary-foreground/20 text-secondary-foreground" : "bg-secondary/20 text-secondary"}`}>
                  {totalFavorites}
                </span>
              )}
            </button>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search spells by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-spells"
                className="pl-9 bg-card/10 border-border focus-visible:ring-secondary text-foreground parchment-texture font-serif placeholder:font-serif"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 flex flex-col gap-4">
          <Tabs value={activeClass} onValueChange={(v) => { setActiveClass(v); setSpellbookOnly(false); }} className="w-full">
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
              data-testid="button-level-all"
              className={`px-4 py-1.5 rounded-sm border font-serif text-sm transition-all whitespace-nowrap ${selectedLevel === "All" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card/10 text-muted-foreground border-border hover:bg-card/20 hover:text-foreground"}`}
            >
              All Levels
            </button>
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                data-testid={`button-level-${lvl}`}
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
          <>
            {spellbookOnly && totalFavorites === 0 ? (
              <div className="flex-1 flex items-center justify-center p-12">
                <div className="max-w-md w-full text-center p-10 parchment-texture border-2 border-card-border rounded-lg shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
                  <Star className="w-12 h-12 mx-auto mb-6 text-secondary/60" />
                  <h2 className="font-serif text-3xl font-bold mb-4 text-primary">Your Spellbook is Empty</h2>
                  <p className="text-muted-foreground font-serif italic text-lg">
                    Star any spell to add it to your personal spellbook for quick access at the table.
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 h-full whitespace-nowrap">
                <div className="flex p-6 gap-6 h-full items-start w-max">
                  {LEVELS.map(level => {
                    if (selectedLevel !== "All" && selectedLevel !== level) return null;

                    const levelSpells = spellsByLevel(level);
                    if (levelSpells.length === 0) return null;

                    const favoriteCount = levelSpells.filter(s => favorites.has(s.id)).length;

                    return (
                      <div key={level} className="w-[320px] flex-shrink-0 flex flex-col h-[calc(100vh-250px)] rounded-md border border-card-border bg-card/60 parchment-texture shadow-lg">
                        <div className="p-3.5 border-b border-card-border/50 bg-black/5 flex justify-between items-center sticky top-0 z-10 rounded-t-md">
                          <h2 className="font-serif font-bold text-xl text-primary drop-shadow-sm">Level {level}</h2>
                          <div className="flex items-center gap-2">
                            {favoriteCount > 0 && (
                              <span className="flex items-center gap-1 text-xs font-mono text-secondary">
                                <Star className="w-3 h-3 fill-secondary" />
                                {favoriteCount}
                              </span>
                            )}
                            <span className="text-xs font-mono bg-background/40 text-foreground px-2 py-1 rounded-sm border border-card-border/50">{levelSpells.length} spells</span>
                          </div>
                        </div>
                        <ScrollArea className="flex-1 p-3.5">
                          <div className="flex flex-col gap-3.5 pb-4">
                            {levelSpells.map((spell, idx) => {
                              const fav = favorites.has(spell.id);
                              const prevFav = idx > 0 && favorites.has(levelSpells[idx - 1].id);
                              const showDivider = !spellbookOnly && idx > 0 && prevFav && !fav && favoriteCount > 0;
                              return (
                                <div key={spell.id}>
                                  {showDivider && (
                                    <div className="flex items-center gap-2 my-1 opacity-50">
                                      <div className="flex-1 h-px bg-card-border" />
                                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">other spells</span>
                                      <div className="flex-1 h-px bg-card-border" />
                                    </div>
                                  )}
                                  <SpellCard
                                    spell={spell}
                                    onClick={() => setSelectedSpell(spell)}
                                    isFavorite={fav}
                                    onToggleFavorite={toggleFavorite}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" className="bg-background/50 border-t border-border" />
              </ScrollArea>
            )}
          </>
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
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <AnimatePresence>
        {selectedSpell && (
          <SpellModal spell={selectedSpell} onClose={() => setSelectedSpell(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
