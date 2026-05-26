import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Plus, MessageSquare, Eye, X, Send, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const tagColors = {
  Python: "bg-chart-4/20 text-chart-4",
  Lua: "bg-accent/15 text-accent",
  MemoryOffset: "bg-chart-2/15 text-chart-2",
  General: "bg-muted text-muted-foreground",
  Help: "bg-destructive/15 text-destructive",
  Showcase: "bg-chart-2/15 text-chart-2",
};

function TopicCard({ topic }) {
  const tags = topic.tags || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:scale-[1.01]"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
          {(topic.author_name || "A")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-foreground group-hover:text-accent transition-colors truncate">{topic.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{topic.body}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {tags.map((t) => (
              <span key={t} className={`text-xs font-medium px-2.5 py-0.5 rounded-lg ${tagColors[t] || tagColors.General}`}>
                #{t}
              </span>
            ))}
            <span className="text-xs text-muted-foreground ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{topic.replies_count || 0}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{topic.views_count || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Forum() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    const data = await base44.entities.ForumTopic.list("-created_date", 50);
    setTopics(data);
    setLoading(false);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const submit = async () => {
    if (!title.trim() || !body.trim()) return toast.error("Title and body are required");
    setSubmitting(true);
    await base44.entities.ForumTopic.create({
      title: title.trim(),
      body: body.trim(),
      tags,
      author_name: user?.full_name || user?.email || "Anonymous",
      replies_count: 0,
      views_count: 0,
    });
    toast.success("Topic created!");
    setTitle(""); setBody(""); setTags([]); setShowNew(false);
    await loadTopics();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <div className="pt-24 pb-24 px-6 max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Community Forum</h1>
            <p className="mt-2 text-muted-foreground">Ask questions, share knowledge, and connect with developers.</p>
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-7 h-7 border-3 border-muted border-t-accent rounded-full animate-spin" />
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No topics yet</p>
              <p className="text-sm mt-1">Be the first to start a discussion!</p>
            </div>
          ) : (
            topics.map((t) => <TopicCard key={t.id} topic={t} />)
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowNew(true)}
        className="fixed bottom-6 right-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 py-3.5 rounded-2xl shadow-xl shadow-accent/20 flex items-center gap-2 transition-all duration-200 hover:scale-105 z-40"
      >
        <Plus className="w-5 h-5" /> New Topic
      </button>

      {/* Modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowNew(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold text-foreground">New Topic</h2>
                <button onClick={() => setShowNew(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Topic title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/50 border-border/50 rounded-xl h-12 text-foreground placeholder:text-muted-foreground"
                />
                <Textarea
                  placeholder="Describe your question or topic..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  className="bg-background/50 border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground resize-none"
                />
                <div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="bg-background/50 border-border/50 rounded-xl h-10 text-foreground placeholder:text-muted-foreground"
                    />
                    <Button variant="outline" size="sm" onClick={addTag} className="rounded-xl h-10 border-border/50">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {tags.map((t) => (
                        <span key={t} className="text-xs bg-accent/15 text-accent px-2.5 py-1 rounded-lg flex items-center gap-1">
                          #{t}
                          <button onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:text-foreground">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={submit}
                  disabled={submitting}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-12 font-semibold"
                >
                  {submitting ? "Posting..." : "Post Topic"}
                  {!submitting && <Send className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}