"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProviderDashboardLayout from "@/components/provider/ProviderDashboardLayout";
import { getRoster, searchCraftworkers, addToRoster, removeFromRoster, updateRosterStatus } from "@/store/slices/providerSlice";
import { Loader2, Plus, X, Trash2, UserMinus, UserPlus, Users, Search, MapPin } from "lucide-react";

export default function ProviderTeams() {
  const dispatch = useDispatch();
  const { roster, searchResults, searchPagination, loading, searchLoading, error } = useSelector((state) => state.provider);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCraftworker, setSelectedCraftworker] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(getRoster());
  }, [dispatch]);

  const handleSearch = () => {
    const filters = {};
    if (searchQuery.trim()) {
      filters.search = searchQuery.trim();
    }
    if (locationFilter.trim()) {
      filters.location = locationFilter.trim();
    }
    dispatch(searchCraftworkers(filters));
  };

  const handleAdd = async () => {
    if (!selectedCraftworker) return;

    setIsAdding(true);
    try {
      await dispatch(addToRoster(selectedCraftworker._id)).unwrap();
      setShowAddModal(false);
      setSelectedCraftworker(null);
      setSearchQuery("");
      setLocationFilter("");
      // Refresh roster
      dispatch(getRoster());
    } catch (error) {
      console.error("Failed to add craftworker:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setSearchQuery("");
    setLocationFilter("");
    setSelectedCraftworker(null);
    // Load initial search results
    dispatch(searchCraftworkers({ limit: 10 }));
  };

  const handleRemove = async (craftsmanId) => {
    if (!confirm("Are you sure you want to remove this craftworker from your roster?")) {
      return;
    }

    try {
      await dispatch(removeFromRoster(craftsmanId)).unwrap();
      // Refresh roster
      dispatch(getRoster());
    } catch (error) {
      console.error("Failed to remove craftworker:", error);
    }
  };

  const handleToggleStatus = async (craftsmanId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await dispatch(updateRosterStatus({ craftsmanId, status: newStatus })).unwrap();
      // Refresh roster
      dispatch(getRoster());
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const activeRoster = roster.filter((item) => item.status === "active");
  const inactiveRoster = roster.filter((item) => item.status === "inactive");

  return (
    <ProviderDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-card-foreground mb-2">My Teams</h1>
          <p className="text-muted-foreground">Manage your craftworker roster</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Craftworker
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {loading && roster.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Roster */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold text-card-foreground">
                Active Roster ({activeRoster.length})
              </h2>
            </div>

            {activeRoster.length === 0 ? (
              <div className="p-8 text-center bg-card border border-border rounded-lg">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No active craftworkers in your roster</p>
                <p className="text-sm text-muted-foreground mt-2">Add craftworkers to start building your team</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRoster.map((item) => {
                  const craftworker = item.craftsmanId;
                  return (
                    <div
                      key={item._id || item.craftsmanId?._id}
                      className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-card-foreground mb-1">
                            {craftworker?.fullName || "Unknown"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {craftworker?.location?.city && craftworker?.location?.state
                              ? `${craftworker.location.city}, ${craftworker.location.state}`
                              : "Location not specified"}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-600 rounded">
                          Active
                        </span>
                      </div>

                      {craftworker?.phone && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Phone:</strong> {craftworker.phone}
                        </p>
                      )}

                      {craftworker?.skills && craftworker.skills.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {craftworker.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {craftworker.skills.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                                +{craftworker.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleToggleStatus(craftworker?._id, item.status)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-card border border-border rounded hover:bg-accent transition-colors"
                        >
                          <UserMinus className="w-4 h-4" />
                          Deactivate
                        </button>
                        <button
                          onClick={() => handleRemove(craftworker?._id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Inactive Roster */}
          {inactiveRoster.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UserMinus className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-2xl font-semibold text-card-foreground">
                  Inactive Roster ({inactiveRoster.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveRoster.map((item) => {
                  const craftworker = item.craftsmanId;
                  return (
                    <div
                      key={item._id || item.craftsmanId?._id}
                      className="p-6 bg-card border border-border rounded-lg opacity-75"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-card-foreground mb-1">
                            {craftworker?.fullName || "Unknown"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {craftworker?.location?.city && craftworker?.location?.state
                              ? `${craftworker.location.city}, ${craftworker.location.state}`
                              : "Location not specified"}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-600 rounded">
                          Inactive
                        </span>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleToggleStatus(craftworker?._id, item.status)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          Activate
                        </button>
                        <button
                          onClick={() => handleRemove(craftworker?._id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Craftworker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-card-foreground">Search & Add Craftworker</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery("");
                  setLocationFilter("");
                  setSelectedCraftworker(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Form */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Search by Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter craftworker name..."
                      className="w-full px-4 py-2 pl-10 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Filter by Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      placeholder="City or State..."
                      className="w-full px-4 py-2 pl-10 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Search className="w-4 h-4 inline mr-2" />
                Search Craftworkers
              </button>
            </div>

            {/* Search Results */}
            {searchLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((craftworker) => (
                  <div
                    key={craftworker._id}
                    onClick={() => setSelectedCraftworker(craftworker)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCraftworker?._id === craftworker._id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-card-foreground mb-1">
                          {craftworker.fullName}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {craftworker.location?.city && craftworker.location?.state
                            ? `${craftworker.location.city}, ${craftworker.location.state}`
                            : 'Location not specified'}
                          {craftworker.phone && ` • ${craftworker.phone}`}
                        </p>
                        {craftworker.skills && craftworker.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {craftworker.skills.slice(0, 5).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {craftworker.skills.length > 5 && (
                              <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded">
                                +{craftworker.skills.length - 5}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No craftworkers found. Try adjusting your search criteria.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={handleAdd}
                disabled={isAdding || !selectedCraftworker}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add {selectedCraftworker ? selectedCraftworker.fullName : 'Craftworker'} to Roster
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery("");
                  setLocationFilter("");
                  setSelectedCraftworker(null);
                }}
                disabled={isAdding}
                className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ProviderDashboardLayout>
  );
}

