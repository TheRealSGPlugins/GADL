import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Eye } from "lucide-react";
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

function TopicCard({ topic, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="group cursor-pointer bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 hover:scale-[1.01]"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
          {(topic.author_name || "A")[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-foreground group-hover:text-accent transition-colors truncate">{topic.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{topic.body}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {(topic.tags || []).map((t) => (
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
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    const data = await base44.entities.ForumTopic.list("-created_date", 50);
    setTopics(data);
    setLoading(false);
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
            topics.map((t) => <TopicCard key={t.id} topic={t} onClick={() => navigate(`/forum/${t.id}`)} />)
          )}
        </div>
      </div>


    </div>
  );
}